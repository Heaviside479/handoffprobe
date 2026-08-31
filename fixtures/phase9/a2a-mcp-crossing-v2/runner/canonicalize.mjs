#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MAX_SAFE_INTEGER = 9_007_199_254_740_991;

function validate(value) {
  if (typeof value === 'number' && !Number.isInteger(value)) {
    throw new TypeError('floating-point JSON is invalid fixture input');
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new TypeError('integer exceeds the interoperable safe range');
  }
  if (typeof value === 'string') {
    for (let index = 0; index < value.length; index += 1) {
      const unit = value.charCodeAt(index);
      if (unit >= 0xD800 && unit <= 0xDBFF) {
        const next = value.charCodeAt(index + 1);
        if (!(next >= 0xDC00 && next <= 0xDFFF)) throw new TypeError('lone Unicode surrogate');
        index += 1;
      } else if (unit >= 0xDC00 && unit <= 0xDFFF) {
        throw new TypeError('lone Unicode surrogate');
      }
    }
  }
  if (Array.isArray(value)) value.forEach(validate);
  else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      validate(key);
      validate(child);
    }
  } else if (!['string', 'number', 'boolean', 'object'].includes(typeof value)) {
    throw new TypeError(`unsupported JSON value: ${typeof value}`);
  }
}

export function parseStrictJson(source) {
  if (typeof source !== 'string') throw new TypeError('raw JSON input must be text');
  let index = 0;
  const whitespace = () => {
    while (index < source.length && /[\u0009\u000a\u000d\u0020]/.test(source[index])) index += 1;
  };
  const parseString = () => {
    const start = index;
    index += 1;
    while (index < source.length) {
      const character = source[index];
      if (character === '"') {
        index += 1;
        const value = JSON.parse(source.slice(start, index));
        validate(value);
        return value;
      }
      if (character === '\\') {
        index += 1;
        const escape = source[index];
        if (escape === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(source.slice(index + 1, index + 5))) {
            throw new SyntaxError('invalid Unicode escape');
          }
          index += 5;
        } else if ('"\\/bfnrt'.includes(escape)) {
          index += 1;
        } else {
          throw new SyntaxError('invalid JSON string escape');
        }
        continue;
      }
      if (character.charCodeAt(0) < 0x20) throw new SyntaxError('unescaped control character');
      index += 1;
    }
    throw new SyntaxError('unterminated JSON string');
  };
  const parseNumber = () => {
    const start = index;
    if (source[index] === '-') index += 1;
    if (source[index] === '0') {
      index += 1;
      if (/[0-9]/.test(source[index] ?? '')) throw new SyntaxError('leading zero in number');
    } else if (/[1-9]/.test(source[index] ?? '')) {
      while (/[0-9]/.test(source[index] ?? '')) index += 1;
    } else {
      throw new SyntaxError('invalid JSON number');
    }
    if (source[index] === '.' || source[index] === 'e' || source[index] === 'E') {
      throw new TypeError('floating-point JSON is invalid fixture input');
    }
    const integer = BigInt(source.slice(start, index));
    if (integer > BigInt(MAX_SAFE_INTEGER) || integer < BigInt(-MAX_SAFE_INTEGER)) {
      throw new TypeError('integer exceeds the interoperable safe range');
    }
    return Number(integer);
  };
  const parseValue = () => {
    whitespace();
    const character = source[index];
    if (character === '"') return parseString();
    if (character === '{') {
      index += 1;
      whitespace();
      const value = {};
      const keys = new Set();
      if (source[index] === '}') {
        index += 1;
        return value;
      }
      while (true) {
        whitespace();
        if (source[index] !== '"') throw new SyntaxError('object key must be a string');
        const key = parseString();
        if (keys.has(key)) throw new TypeError(`duplicate JSON object key: ${key}`);
        keys.add(key);
        whitespace();
        if (source[index] !== ':') throw new SyntaxError('missing colon after object key');
        index += 1;
        value[key] = parseValue();
        whitespace();
        if (source[index] === '}') {
          index += 1;
          return value;
        }
        if (source[index] !== ',') throw new SyntaxError('missing comma in object');
        index += 1;
      }
    }
    if (character === '[') {
      index += 1;
      whitespace();
      const value = [];
      if (source[index] === ']') {
        index += 1;
        return value;
      }
      while (true) {
        value.push(parseValue());
        whitespace();
        if (source[index] === ']') {
          index += 1;
          return value;
        }
        if (source[index] !== ',') throw new SyntaxError('missing comma in array');
        index += 1;
      }
    }
    for (const [literal, value] of [['true', true], ['false', false], ['null', null]]) {
      if (source.startsWith(literal, index)) {
        index += literal.length;
        return value;
      }
    }
    if (character === '-' || /[0-9]/.test(character ?? '')) return parseNumber();
    throw new SyntaxError('invalid JSON value');
  };
  const value = parseValue();
  whitespace();
  if (index !== source.length) throw new SyntaxError('trailing data after JSON value');
  validate(value);
  return value;
}

function text(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(text).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${text(value[key])}`).join(',')}}`;
}

export function canonicalize(value) {
  validate(value);
  return Buffer.from(text(value), 'utf8');
}

export function digest(value) {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}

export { MAX_SAFE_INTEGER };

function renderVector(vector) {
  try {
    return { description: vector.description, canonical: canonicalize(vector.value).toString('utf8'), sha256: digest(vector.value) };
  } catch (error) {
    return { description: vector.description, error: error.message };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode, path] = process.argv.slice(2);
  if (mode === '--raw') {
    const value = parseStrictJson(readFileSync(path, 'utf8'));
    process.stdout.write(`${JSON.stringify({ canonical: canonicalize(value).toString('utf8'), sha256: digest(value) })}\n`);
  } else if (mode === '--raw-cases') {
    const vectors = JSON.parse(readFileSync(path, 'utf8'));
    const results = vectors.map((vector) => {
      try {
        parseStrictJson(vector.json);
        return { description: vector.description, accepted: true };
      } catch (error) {
        return { description: vector.description, error: error.message };
      }
    });
    process.stdout.write(`${JSON.stringify(results)}\n`);
  } else if (mode === '--vectors') {
    const vectors = JSON.parse(readFileSync(path, 'utf8'));
    process.stdout.write(`${JSON.stringify(vectors.map(renderVector))}\n`);
  } else {
    throw new Error('usage: canonicalize.mjs --raw|--raw-cases|--vectors PATH');
  }
}
