"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  colors: () => import_kleur2.default,
  logger: () => logger,
  quote: () => quote
});
module.exports = __toCommonJS(src_exports);
var import_kleur2 = __toESM(require("kleur"));

// src/create-logger.ts
var import_kleur = __toESM(require("kleur"));

// ../../node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js
function escapeStringRegexp(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// ../../node_modules/.pnpm/matcher@5.0.0/node_modules/matcher/index.js
var regexpCache = /* @__PURE__ */ new Map();
var sanitizeArray = (input, inputName) => {
  if (!Array.isArray(input)) {
    switch (typeof input) {
      case "string":
        input = [input];
        break;
      case "undefined":
        input = [];
        break;
      default:
        throw new TypeError(`Expected '${inputName}' to be a string or an array, but got a type of '${typeof input}'`);
    }
  }
  return input.filter((string) => {
    if (typeof string !== "string") {
      if (typeof string === "undefined") {
        return false;
      }
      throw new TypeError(`Expected '${inputName}' to be an array of strings, but found a type of '${typeof string}' in the array`);
    }
    return true;
  });
};
var makeRegexp = (pattern, options) => {
  options = {
    caseSensitive: false,
    ...options
  };
  const cacheKey = pattern + JSON.stringify(options);
  if (regexpCache.has(cacheKey)) {
    return regexpCache.get(cacheKey);
  }
  const negated = pattern[0] === "!";
  if (negated) {
    pattern = pattern.slice(1);
  }
  pattern = escapeStringRegexp(pattern).replace(/\\\*/g, "[\\s\\S]*");
  const regexp = new RegExp(`^${pattern}$`, options.caseSensitive ? "" : "i");
  regexp.negated = negated;
  regexpCache.set(cacheKey, regexp);
  return regexp;
};
var baseMatcher = (inputs, patterns, options, firstMatchOnly) => {
  inputs = sanitizeArray(inputs, "inputs");
  patterns = sanitizeArray(patterns, "patterns");
  if (patterns.length === 0) {
    return [];
  }
  patterns = patterns.map((pattern) => makeRegexp(pattern, options));
  const { allPatterns } = options || {};
  const result = [];
  for (const input of inputs) {
    let matches2;
    const didFit = [...patterns].fill(false);
    for (const [index, pattern] of patterns.entries()) {
      if (pattern.test(input)) {
        didFit[index] = true;
        matches2 = !pattern.negated;
        if (!matches2) {
          break;
        }
      }
    }
    if (!(matches2 === false || matches2 === void 0 && patterns.some((pattern) => !pattern.negated) || allPatterns && didFit.some((yes, index) => !yes && !patterns[index].negated))) {
      result.push(input);
      if (firstMatchOnly) {
        break;
      }
    }
  }
  return result;
};
function isMatch(inputs, patterns, options) {
  return baseMatcher(inputs, patterns, options, true).length > 0;
}

// src/create-logger.ts
var createLogger = (conf = {}) => {
  let onLog = conf.onLog;
  let level = conf.isDebug ? "debug" : conf.level ?? "info";
  const filter = conf.filter !== "*" ? conf.filter?.split(/[\s,]+/) ?? [] : [];
  const getLevel = () => filter.length ? "debug" : level;
  const isValid = (level2, type) => {
    const badLevel = logLevels[getLevel()].weight > logLevels[level2].weight;
    const badType = filter.length > 0 && !matches(filter, type);
    return !(badType || badLevel);
  };
  const stdout = (level2) => (type, data) => {
    const entry = createEntry(level2, type, data);
    if (level2 != null && isValid(level2, type)) {
      const logEntry = formatEntry(entry) ?? {};
      console.log(logEntry.label, logEntry.msg);
    } else if (getLevel() !== "silent" && level2 == null) {
      console.log(...[type, data].filter(Boolean));
    }
    onLog?.(entry);
  };
  const logFns = {
    debug: stdout("debug"),
    info: stdout("info"),
    warn: stdout("warn"),
    error: stdout("error")
  };
  const timing = (level2) => (msg) => {
    const start = performance.now();
    return (_msg = msg) => {
      const end = performance.now();
      const ms = end - start;
      logFns[level2]("hrtime", `${_msg} ${import_kleur.default.gray(`(${ms.toFixed(2)}ms)`)}`);
    };
  };
  return {
    get level() {
      return level;
    },
    set level(newLevel) {
      level = newLevel;
    },
    set onLog(fn) {
      onLog = fn;
    },
    ...logFns,
    print(data) {
      console.dir(data, { depth: null, colors: true });
    },
    log: (data) => stdout(null)("", data),
    time: {
      info: timing("info"),
      debug: timing("debug")
    },
    isDebug: Boolean(conf.isDebug)
  };
};
var matches = (filters, value) => filters.some((search) => isMatch(value, search));
var createEntry = (level, type, data) => {
  const msg = data instanceof Error ? import_kleur.default.red(data.stack ?? data.message) : data;
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return { t: timestamp, type, level, msg };
};
var formatEntry = (entry) => {
  const uword = entry.type ? import_kleur.default.gray(`[${entry.type}]`) : "";
  let label = "";
  let msg = "";
  if (entry.level != null) {
    const { msg: message, level } = entry;
    const color = logLevels[level].color;
    const levelLabel = import_kleur.default.bold(color(`${level}`));
    label = [`\u{1F43C}`, levelLabel, uword].filter(Boolean).join(" ");
    msg = message;
  } else {
    label = uword ?? "";
    msg = entry.msg;
  }
  return { label, msg };
};
var logLevels = {
  debug: { weight: 0, color: import_kleur.default.magenta },
  info: { weight: 1, color: import_kleur.default.blue },
  warn: { weight: 2, color: import_kleur.default.yellow },
  error: { weight: 3, color: import_kleur.default.red },
  silent: { weight: 4, color: import_kleur.default.white }
};

// src/index.ts
var quote = (...str) => import_kleur2.default.cyan(`\`${str.join("")}\``);
var debug = typeof process !== "undefined" ? process.env.PANDA_DEBUG : void 0;
var logger = createLogger({
  filter: typeof process !== "undefined" ? debug : void 0,
  isDebug: Boolean(debug)
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  colors,
  logger,
  quote
});
