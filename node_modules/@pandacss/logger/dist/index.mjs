// src/index.ts
import colors2 from "kleur";

// src/create-logger.ts
import colors from "kleur";

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
      logFns[level2]("hrtime", `${_msg} ${colors.gray(`(${ms.toFixed(2)}ms)`)}`);
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
  const msg = data instanceof Error ? colors.red(data.stack ?? data.message) : data;
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  return { t: timestamp, type, level, msg };
};
var formatEntry = (entry) => {
  const uword = entry.type ? colors.gray(`[${entry.type}]`) : "";
  let label = "";
  let msg = "";
  if (entry.level != null) {
    const { msg: message, level } = entry;
    const color = logLevels[level].color;
    const levelLabel = colors.bold(color(`${level}`));
    label = [`\u{1F43C}`, levelLabel, uword].filter(Boolean).join(" ");
    msg = message;
  } else {
    label = uword ?? "";
    msg = entry.msg;
  }
  return { label, msg };
};
var logLevels = {
  debug: { weight: 0, color: colors.magenta },
  info: { weight: 1, color: colors.blue },
  warn: { weight: 2, color: colors.yellow },
  error: { weight: 3, color: colors.red },
  silent: { weight: 4, color: colors.white }
};

// src/index.ts
var quote = (...str) => colors2.cyan(`\`${str.join("")}\``);
var debug = typeof process !== "undefined" ? process.env.PANDA_DEBUG : void 0;
var logger = createLogger({
  filter: typeof process !== "undefined" ? debug : void 0,
  isDebug: Boolean(debug)
});
export {
  colors2 as colors,
  logger,
  quote
};
