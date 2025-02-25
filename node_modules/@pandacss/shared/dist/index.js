"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CacheMap: () => CacheMap,
  PANDA_CONFIG_NAME: () => PANDA_CONFIG_NAME,
  PandaError: () => PandaError,
  assign: () => assign,
  astish: () => astish,
  calc: () => calc,
  camelCaseProperty: () => camelCaseProperty,
  capitalize: () => capitalize,
  compact: () => compact,
  createCss: () => createCss,
  createMergeCss: () => createMergeCss,
  createRegex: () => createRegex,
  cssVar: () => cssVar,
  dashCase: () => dashCase,
  deepSet: () => deepSet,
  entries: () => entries,
  esc: () => esc2,
  filterBaseConditions: () => filterBaseConditions,
  flatten: () => flatten,
  fromEntries: () => fromEntries,
  getArbitraryValue: () => getArbitraryValue,
  getDotPath: () => getDotPath,
  getNegativePath: () => getNegativePath,
  getOrCreateSet: () => getOrCreateSet,
  getPatternStyles: () => getPatternStyles,
  getPropertyPriority: () => getPropertyPriority,
  getSlotCompoundVariant: () => getSlotCompoundVariant,
  getSlotRecipes: () => getSlotRecipes,
  getUnit: () => getUnit,
  hypenateProperty: () => hypenateProperty,
  isBaseCondition: () => isBaseCondition,
  isBoolean: () => isBoolean,
  isCssFunction: () => isCssFunction,
  isCssUnit: () => isCssUnit,
  isCssVar: () => isCssVar2,
  isFunction: () => isFunction,
  isImportant: () => isImportant,
  isObject: () => isObject,
  isObjectOrArray: () => isObjectOrArray,
  isString: () => isString,
  mapEntries: () => mapEntries,
  mapObject: () => mapObject,
  mapToJson: () => mapToJson,
  markImportant: () => markImportant,
  memo: () => memo,
  mergeProps: () => mergeProps,
  mergeWith: () => mergeWith,
  normalizeStyleObject: () => normalizeStyleObject,
  omit: () => omit,
  parseJson: () => parseJson,
  patternFns: () => patternFns,
  splitBy: () => splitBy,
  splitDotPath: () => splitDotPath,
  splitProps: () => splitProps,
  stringifyJson: () => stringifyJson,
  toEm: () => toEm,
  toHash: () => toHash,
  toPx: () => toPx,
  toRem: () => toRem,
  toResponsiveObject: () => toResponsiveObject,
  traverse: () => traverse,
  uncapitalize: () => uncapitalize,
  unionType: () => unionType,
  uniq: () => uniq,
  walkObject: () => walkObject,
  withoutImportant: () => withoutImportant,
  withoutSpace: () => withoutSpace
});
module.exports = __toCommonJS(src_exports);

// src/arbitrary-value.ts
var getArbitraryValue = (_value) => {
  if (!_value || typeof _value !== "string")
    return _value;
  const value = _value.trim();
  if (value[0] === "[" && value[value.length - 1] === "]") {
    const innerValue = value.slice(1, -1);
    let bracketCount = 0;
    for (let i = 0; i < innerValue.length; i++) {
      if (innerValue[i] === "[") {
        bracketCount++;
      } else if (innerValue[i] === "]") {
        if (bracketCount === 0) {
          return value;
        }
        bracketCount--;
      }
    }
    if (bracketCount === 0) {
      return innerValue.trim();
    }
  }
  return value;
};

// src/assert.ts
var isString = (v) => typeof v === "string";
var isBoolean = (v) => typeof v === "boolean";
var isFunction = (v) => typeof v === "function";
function isObject(value) {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
var isObjectOrArray = (obj) => typeof obj === "object" && obj !== null;

// src/assign.ts
function assign(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (!target?.hasOwnProperty?.(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// src/astish.ts
var newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
var ruleClean = /\/\*[^]*?\*\/|  +/g;
var ruleNewline = /\n+/g;
var empty = " ";
var astish = (val, tree = [{}]) => {
  if (!val)
    return tree[0];
  let block, left;
  while (block = newRule.exec(val.replace(ruleClean, ""))) {
    if (block[4])
      tree.shift();
    else if (block[3]) {
      left = block[3].replace(ruleNewline, empty).trim();
      if (!left.includes("&") && !left.startsWith("@"))
        left = "& " + left;
      tree.unshift(tree[0][left] = tree[0][left] || {});
    } else
      tree[0][block[1]] = block[2].replace(ruleNewline, empty).trim();
  }
  return tree[0];
};

// src/cache-map.ts
var CacheMap = class {
  cache;
  keysInUse;
  maxCacheSize;
  constructor(maxCacheSize = 1e3) {
    this.maxCacheSize = maxCacheSize;
    this.cache = /* @__PURE__ */ new Map();
    this.keysInUse = [];
  }
  get(key) {
    if (!this.cache.has(key)) {
      return void 0;
    }
    this.updateKeyUsage(key);
    return this.cache.get(key);
  }
  set(key, value) {
    if (!this.cache.has(key) && this.cache.size === this.maxCacheSize) {
      this.evictLeastRecentlyUsed();
    }
    this.cache.set(key, value);
    this.updateKeyUsage(key);
    return this;
  }
  delete(key) {
    const result = this.cache.delete(key);
    if (result) {
      const index = this.keysInUse.indexOf(key);
      if (index !== -1) {
        this.keysInUse.splice(index, 1);
      }
    }
    return result;
  }
  updateKeyUsage(key) {
    const index = this.keysInUse.indexOf(key);
    if (index !== -1) {
      this.keysInUse.splice(index, 1);
    }
    this.keysInUse.push(key);
  }
  evictLeastRecentlyUsed() {
    const keyToEvict = this.keysInUse.shift();
    if (keyToEvict !== void 0) {
      this.cache.delete(keyToEvict);
    }
  }
  clear() {
    this.cache.clear();
    this.keysInUse = [];
  }
  has(key) {
    return this.cache.has(key);
  }
  get size() {
    return this.cache.size;
  }
  forEach(callback2, thisArg) {
    this.cache.forEach(callback2, thisArg);
  }
  keys() {
    return this.cache.keys();
  }
  values() {
    return this.cache.values();
  }
  entries() {
    return this.cache.entries();
  }
  [Symbol.iterator]() {
    return this.cache[Symbol.iterator]();
  }
  [Symbol.toStringTag] = "CacheMap";
  toJSON = () => {
    return this.cache;
  };
};

// src/calc.ts
function isCssVar(value) {
  return isObject(value) && "ref" in value;
}
function getRef(operand) {
  return isCssVar(operand) ? operand.ref : operand.toString();
}
var calcRegex = /calc/g;
var toExpression = (operator, ...operands) => operands.map(getRef).join(` ${operator} `).replace(calcRegex, "");
var multiply = (...operands) => `calc(${toExpression("*", ...operands)})`;
var calc = {
  negate(x) {
    const value = getRef(x);
    if (value != null && !Number.isNaN(parseFloat(value))) {
      return String(value).startsWith("-") ? String(value).slice(1) : `-${value}`;
    }
    return multiply(value, -1);
  }
};

// src/memo.ts
var memo = (fn) => {
  const cache = /* @__PURE__ */ new Map();
  const get = (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
  return get;
};

// src/camelcase-property.ts
var regex = /-(\w|$)/g;
var callback = (_dashChar, char) => char.toUpperCase();
var camelCaseProperty = memo((property) => {
  if (property.startsWith("--"))
    return property;
  let str = property.toLowerCase();
  str = str.startsWith("-ms-") ? str.substring(1) : str;
  return str.replace(regex, callback);
});

// src/capitalize.ts
var capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
var camelCaseRegex = /([a-z])([A-Z])/g;
var dashCase = (s) => s.replace(camelCaseRegex, "$1-$2").toLowerCase();
var uncapitalize = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// src/compact.ts
function compact(value) {
  return Object.fromEntries(Object.entries(value ?? {}).filter(([_, value2]) => value2 !== void 0));
}

// src/condition.ts
var isBaseCondition = (v) => v === "base";
function filterBaseConditions(c) {
  return c.slice().filter((v) => !isBaseCondition(v));
}

// src/hash.ts
function toChar(code) {
  return String.fromCharCode(code + (code > 25 ? 39 : 97));
}
function toName(code) {
  let name = "";
  let x;
  for (x = Math.abs(code); x > 52; x = x / 52 | 0)
    name = toChar(x % 52) + name;
  return toChar(x % 52) + name;
}
function toPhash(h, x) {
  let i = x.length;
  while (i)
    h = h * 33 ^ x.charCodeAt(--i);
  return h;
}
function toHash(value) {
  return toName(toPhash(5381, value) >>> 0);
}

// src/important.ts
var importantRegex = /\s*!(important)?/i;
function isImportant(value) {
  return typeof value === "string" ? importantRegex.test(value) : false;
}
function withoutImportant(value) {
  return typeof value === "string" ? value.replace(importantRegex, "").trim() : value;
}
function withoutSpace(str) {
  return typeof str === "string" ? str.replaceAll(" ", "_") : str;
}
function markImportant(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const result = Array.isArray(obj) ? [] : {};
  const stack = [{ obj, result }];
  while (stack.length > 0) {
    const { obj: obj2, result: result2 } = stack.pop();
    for (const [key, value] of Object.entries(obj2)) {
      if (typeof value === "string" || typeof value === "number") {
        result2[key] = `${value} !important`;
      } else if (typeof value === "object" && value !== null) {
        const next = Array.isArray(value) ? [] : {};
        result2[key] = next;
        stack.push({ obj: value, result: next });
      } else {
        result2[key] = value;
      }
    }
  }
  return result;
}

// src/merge-props.ts
function mergeProps(...sources) {
  return sources.reduce((prev, obj) => {
    if (!obj)
      return prev;
    Object.keys(obj).forEach((key) => {
      const prevValue = prev[key];
      const value = obj[key];
      if (isObject(prevValue) && isObject(value)) {
        prev[key] = mergeProps(prevValue, value);
      } else {
        prev[key] = value;
      }
    });
    return prev;
  }, {});
}

// src/walk-object.ts
var isNotNullish = (element) => element != null;
function walkObject(target, predicate, options = {}) {
  const { stop, getKey } = options;
  function inner(value, path = []) {
    if (isObjectOrArray(value)) {
      const result = {};
      for (const [prop, child] of Object.entries(value)) {
        const key = getKey?.(prop, child) ?? prop;
        const childPath = [...path, key];
        if (stop?.(value, childPath)) {
          return predicate(value, path);
        }
        const next = inner(child, childPath);
        if (isNotNullish(next)) {
          result[key] = next;
        }
      }
      return result;
    }
    return predicate(value, path);
  }
  return inner(target);
}
function mapObject(obj, fn) {
  if (Array.isArray(obj))
    return obj.map((value) => fn(value));
  if (!isObject(obj))
    return fn(obj);
  return walkObject(obj, (value) => fn(value));
}

// src/normalize-style-object.ts
function toResponsiveObject(values, breakpoints) {
  return values.reduce(
    (acc, current, index) => {
      const key = breakpoints[index];
      if (current != null) {
        acc[key] = current;
      }
      return acc;
    },
    {}
  );
}
function normalizeStyleObject(styles, context, shorthand = true) {
  const { utility, conditions } = context;
  const { hasShorthand, resolveShorthand } = utility;
  return walkObject(
    styles,
    (value) => {
      return Array.isArray(value) ? toResponsiveObject(value, conditions.breakpoints.keys) : value;
    },
    {
      stop: (value) => Array.isArray(value),
      getKey: shorthand ? (prop) => hasShorthand ? resolveShorthand(prop) : prop : void 0
    }
  );
}

// src/classname.ts
var fallbackCondition = {
  shift: (v) => v,
  finalize: (v) => v,
  breakpoints: { keys: [] }
};
var sanitize = (value) => typeof value === "string" ? value.replaceAll(/[\n\s]+/g, " ") : value;
function createCss(context) {
  const { utility, hash, conditions: conds = fallbackCondition } = context;
  const formatClassName = (str) => [utility.prefix, str].filter(Boolean).join("-");
  const hashFn = (conditions, className) => {
    let result;
    if (hash) {
      const baseArray = [...conds.finalize(conditions), className];
      result = formatClassName(utility.toHash(baseArray, toHash));
    } else {
      const baseArray = [...conds.finalize(conditions), formatClassName(className)];
      result = baseArray.join(":");
    }
    return result;
  };
  return memo(({ base, ...styles } = {}) => {
    const styleObject = Object.assign(styles, base);
    const normalizedObject = normalizeStyleObject(styleObject, context);
    const classNames = /* @__PURE__ */ new Set();
    walkObject(normalizedObject, (value, paths) => {
      if (value == null)
        return;
      const important = isImportant(value);
      const [prop, ...allConditions] = conds.shift(paths);
      const conditions = filterBaseConditions(allConditions);
      const transformed = utility.transform(prop, withoutImportant(sanitize(value)));
      let className = hashFn(conditions, transformed.className);
      if (important)
        className = `${className}!`;
      classNames.add(className);
    });
    return Array.from(classNames).join(" ");
  });
}
function compactStyles(...styles) {
  return styles.flat().filter((style) => isObject(style) && Object.keys(compact(style)).length > 0);
}
function createMergeCss(context) {
  function resolve(styles) {
    const allStyles = compactStyles(...styles);
    if (allStyles.length === 1)
      return allStyles;
    return allStyles.map((style) => normalizeStyleObject(style, context));
  }
  function mergeCss(...styles) {
    return mergeProps(...resolve(styles));
  }
  function assignCss(...styles) {
    return Object.assign({}, ...resolve(styles));
  }
  return { mergeCss: memo(mergeCss), assignCss };
}

// src/css-var.ts
var escRegex = /[^a-zA-Z0-9_\u0081-\uffff-]/g;
function esc(string) {
  return `${string}`.replace(escRegex, (s) => `\\${s}`);
}
var dashCaseRegex = /[A-Z]/g;
function dashCase2(string) {
  return string.replace(dashCaseRegex, (match) => `-${match.toLowerCase()}`);
}
function cssVar(name, options = {}) {
  const { fallback = "", prefix = "", hash } = options;
  const variable = hash ? ["-", prefix, toHash(name)].filter(Boolean).join("-") : dashCase2(["-", prefix, esc(name)].filter(Boolean).join("-"));
  const result = {
    var: variable,
    ref: `var(${variable}${fallback ? `, ${fallback}` : ""})`
  };
  return result;
}

// src/deep-set.ts
var deepSet = (target, path, value) => {
  const isValueObject = isObject(value);
  if (!path.length && isValueObject) {
    return mergeProps(target, value);
  }
  let current = target;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    current[key] ||= {};
    if (i === path.length - 1) {
      if (isValueObject && isObject(current[key])) {
        current[key] = mergeProps(current[key], value);
      } else {
        current[key] = value;
      }
    } else {
      current = current[key];
    }
  }
  return target;
};

// src/entries.ts
function fromEntries(entries2) {
  const result = {};
  entries2.forEach((kv) => {
    result[kv[0]] = kv[1];
  });
  return result;
}
function entries(obj) {
  const result = [];
  for (const key in obj) {
    result.push([key, obj[key]]);
  }
  return result;
}
function mapEntries(obj, f) {
  const result = {};
  for (const key in obj) {
    const kv = f(key, obj[key]);
    result[kv[0]] = kv[1];
  }
  return result;
}

// src/error.ts
var PandaError = class extends Error {
  code;
  hint;
  constructor(code, message, opts) {
    super(message);
    this.code = `ERR_PANDA_${code}`;
    this.hint = opts?.hint;
  }
};

// src/esc.ts
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|^-|[^\x80-\uFFFF\w-]/g;
var fcssescape = function(ch, asCodePoint) {
  if (!asCodePoint)
    return "\\" + ch;
  if (ch === "\0")
    return "\uFFFD";
  if (ch === "-" && ch.length === 1)
    return "\\-";
  return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16);
};
var esc2 = (sel) => {
  return (sel + "").replace(rcssescape, fcssescape);
};

// src/flatten.ts
function filterDefault(path) {
  if (path[0] === "DEFAULT")
    return path;
  return path.filter((item) => item !== "DEFAULT");
}
function flatten(values, stop) {
  const result = {};
  walkObject(
    values,
    (token, paths) => {
      paths = filterDefault(paths);
      if (token) {
        result[paths.join(".")] = token.value;
      }
    },
    {
      stop: stop ?? ((v) => {
        return isObject(v) && "value" in v;
      })
    }
  );
  return result;
}

// src/get-or-create-set.ts
function getOrCreateSet(map, key) {
  let set = map.get(key);
  if (!set) {
    map.set(key, /* @__PURE__ */ new Set());
    set = map.get(key);
  }
  return set;
}

// src/hypenate-property.ts
var wordRegex = /([A-Z])/g;
var msRegex = /^ms-/;
var hypenateProperty = memo((property) => {
  if (property.startsWith("--"))
    return property;
  return property.replace(wordRegex, "-$1").replace(msRegex, "-ms-").toLowerCase();
});

// src/is-css-function.ts
var fns = ["min", "max", "clamp", "calc"];
var fnRegExp = new RegExp(`^(${fns.join("|")})\\(.*\\)`);
var isCssFunction = (v) => typeof v === "string" && fnRegExp.test(v);

// src/is-css-unit.ts
var lengthUnits = "cm,mm,Q,in,pc,pt,px,em,ex,ch,rem,lh,rlh,vw,vh,vmin,vmax,vb,vi,svw,svh,lvw,lvh,dvw,dvh,cqw,cqh,cqi,cqb,cqmin,cqmax,%";
var lengthUnitsPattern = `(?:${lengthUnits.split(",").join("|")})`;
var lengthRegExp = new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${lengthUnitsPattern}$`);
var isCssUnit = (v) => typeof v === "string" && lengthRegExp.test(v);

// src/is-css-var.ts
var isCssVar2 = (v) => typeof v === "string" && /^var\(--.+\)$/.test(v);

// src/merge-with.ts
function mergeWith(target, ...sources) {
  const customizer = sources.pop();
  for (const source of sources) {
    for (const key in source) {
      const merged = customizer(target[key], source[key]);
      if (merged === void 0) {
        if (isObject(target[key]) && isObject(source[key])) {
          target[key] = mergeWith({}, target[key], source[key], customizer);
        } else {
          target[key] = source[key];
        }
      } else {
        target[key] = merged;
      }
    }
  }
  return target;
}

// src/traverse.ts
var defaultOptions = {
  separator: ".",
  maxDepth: Infinity
};
function traverse(obj, callback2, options = defaultOptions) {
  const maxDepth = options.maxDepth ?? defaultOptions.maxDepth;
  const separator = options.separator ?? defaultOptions.separator;
  const stack = [{ value: obj, path: "", paths: [], depth: -1, parent: null, key: "" }];
  while (stack.length > 0) {
    const currentItem = stack.pop();
    if (currentItem.parent !== null) {
      callback2(currentItem);
    }
    if (options.stop?.(currentItem)) {
      continue;
    }
    if (isObjectOrArray(currentItem.value) && currentItem.depth < maxDepth) {
      const keys = Object.keys(currentItem.value);
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i];
        const value = currentItem.value[key];
        const path = currentItem.path ? currentItem.path + separator + key : key;
        const paths = currentItem.paths.concat(key);
        stack.push({
          value,
          path,
          paths,
          depth: currentItem.depth + 1,
          parent: currentItem.value,
          key
        });
      }
    }
  }
}

// src/omit.ts
var omit = (obj, paths) => {
  const result = { ...obj };
  traverse(result, ({ path, parent, key }) => {
    if (paths.includes(path)) {
      delete parent[key];
    }
  });
  return result;
};

// src/panda-config-name.ts
var PANDA_CONFIG_NAME = "__panda.config__";

// src/pattern-fns.ts
var patternFns = {
  map: mapObject,
  isCssFunction,
  isCssVar: isCssVar2,
  isCssUnit
};
var getPatternStyles = (pattern, styles) => {
  if (!pattern?.defaultValues)
    return styles;
  const defaults = typeof pattern.defaultValues === "function" ? pattern.defaultValues(styles) : pattern.defaultValues;
  return Object.assign({}, defaults, compact(styles));
};

// src/regex.ts
var createRegex = (item) => {
  const regex2 = item.map((item2) => typeof item2 === "string" ? `^${item2}$` : item2.source).join("|");
  return new RegExp(regex2);
};

// src/serialize.ts
var stringifyJson = (config) => {
  return JSON.stringify(config, (_key, value) => {
    if (typeof value === "function")
      return value.toString();
    return value;
  });
};
var parseJson = (config) => {
  return JSON.parse(config);
};

// src/shorthand-properties.ts
var shorthandProperties = {
  animation: [
    "animationName",
    "animationDuration",
    "animationTimingFunction",
    "animationDelay",
    "animationIterationCount",
    "animationDirection",
    "animationFillMode",
    "animationPlayState"
  ],
  background: [
    "backgroundImage",
    "backgroundPosition",
    "backgroundSize",
    "backgroundRepeat",
    "backgroundAttachment",
    "backgroundOrigin",
    "backgroundClip",
    "backgroundColor"
  ],
  backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
  border: ["borderWidth", "borderStyle", "borderColor"],
  borderBlockEnd: ["borderBlockEndWidth", "borderBlockEndStyle", "borderBlockEndColor"],
  borderBlockStart: ["borderBlockStartWidth", "borderBlockStartStyle", "borderBlockStartColor"],
  borderBottom: ["borderBottomWidth", "borderBottomStyle", "borderBottomColor"],
  borderColor: ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
  borderImage: ["borderImageSource", "borderImageSlice", "borderImageWidth", "borderImageOutset", "borderImageRepeat"],
  borderInlineEnd: ["borderInlineEndWidth", "borderInlineEndStyle", "borderInlineEndColor"],
  borderInlineStart: ["borderInlineStartWidth", "borderInlineStartStyle", "borderInlineStartColor"],
  borderLeft: ["borderLeftWidth", "borderLeftStyle", "borderLeftColor"],
  borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
  borderRight: ["borderRightWidth", "borderRightStyle", "borderRightColor"],
  borderStyle: ["borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle"],
  borderTop: ["borderTopWidth", "borderTopStyle", "borderTopColor"],
  borderWidth: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
  columnRule: ["columnRuleWidth", "columnRuleStyle", "columnRuleColor"],
  columns: ["columnWidth", "columnCount"],
  container: ["contain", "content"],
  containIntrinsicSize: ["containIntrinsicSizeInline", "containIntrinsicSizeBlock"],
  cue: ["cueBefore", "cueAfter"],
  flex: ["flexGrow", "flexShrink", "flexBasis"],
  flexFlow: ["flexDirection", "flexWrap"],
  font: [
    "fontStyle",
    "fontVariantCaps",
    "fontVariantEastAsian",
    "fontVariantLigatures",
    "fontVariantNumeric",
    "fontVariantPosition",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "lineHeight",
    "fontFamily"
  ],
  fontSynthesis: ["fontSynthesisWeight", "fontSynthesisStyle", "fontSynthesisSmallCaps"],
  fontVariant: [
    "fontVariantCaps",
    "fontVariantEastAsian",
    "fontVariantLigatures",
    "fontVariantNumeric",
    "fontVariantPosition"
  ],
  gap: ["columnGap", "rowGap"],
  grid: [
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridTemplateAreas",
    "gridAutoColumns",
    "gridAutoRows",
    "gridAutoFlow"
  ],
  gridArea: ["gridRowStart", "gridColumnStart", "gridRowEnd", "gridColumnEnd"],
  gridColumn: ["gridColumnStart", "gridColumnEnd"],
  gridGap: ["gridColumnGap", "gridRowGap"],
  gridRow: ["gridRowStart", "gridRowEnd"],
  gridTemplate: ["gridTemplateColumns", "gridTemplateRows", "gridTemplateAreas"],
  inset: ["top", "right", "bottom", "left"],
  listStyle: ["listStyleType", "listStylePosition", "listStyleImage"],
  margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
  mask: ["maskImage", "maskMode", "maskRepeat", "maskPosition", "maskClip", "maskOrigin", "maskSize", "maskComposite"],
  maskBorder: [
    "maskBorderSource",
    "maskBorderMode",
    "maskBorderSlice",
    "maskBorderWidth",
    "maskBorderOutset",
    "maskBorderRepeat"
  ],
  offset: ["offsetPosition", "offsetPath", "offsetDistance", "offsetRotate", "offsetAnchor"],
  outline: ["outlineWidth", "outlineStyle", "outlineColor"],
  overflow: ["overflowX", "overflowY"],
  padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
  pause: ["pauseBefore", "pauseAfter"],
  placeContent: ["alignContent", "justifyContent"],
  placeItems: ["alignItems", "justifyItems"],
  placeSelf: ["alignSelf", "justifySelf"],
  rest: ["restBefore", "restAfter"],
  scrollMargin: ["scrollMarginTop", "scrollMarginRight", "scrollMarginBottom", "scrollMarginLeft"],
  scrollPadding: ["scrollPaddingTop", "scrollPaddingRight", "scrollPaddingBottom", "scrollPaddingLeft"],
  scrollPaddingBlock: ["scrollPaddingBlockStart", "scrollPaddingBlockEnd"],
  scrollPaddingInline: ["scrollPaddingInlineStart", "scrollPaddingInlineEnd"],
  scrollSnapMargin: ["scrollSnapMarginTop", "scrollSnapMarginRight", "scrollSnapMarginBottom", "scrollSnapMarginLeft"],
  scrollSnapMarginBlock: ["scrollSnapMarginBlockStart", "scrollSnapMarginBlockEnd"],
  scrollSnapMarginInline: ["scrollSnapMarginInlineStart", "scrollSnapMarginInlineEnd"],
  scrollTimeline: ["scrollTimelineSource", "scrollTimelineOrientation"],
  textDecoration: ["textDecorationLine", "textDecorationStyle", "textDecorationColor"],
  textEmphasis: ["textEmphasisStyle", "textEmphasisColor"],
  transition: ["transitionProperty", "transitionDuration", "transitionTimingFunction", "transitionDelay"]
};
var longhands = Object.values(shorthandProperties).reduce((a, b) => {
  b.forEach((val) => a.add(val));
  return a;
}, /* @__PURE__ */ new Set([]));
function getPropertyPriority(property) {
  if (property === "all")
    return 0;
  return longhands.has(property) ? 2 : 1;
}

// src/slot.ts
var getSlotRecipes = (recipe = {}) => {
  const init = (slot) => ({
    className: [recipe.className, slot].filter(Boolean).join("__"),
    base: recipe.base?.[slot] ?? {},
    variants: {},
    defaultVariants: recipe.defaultVariants ?? {},
    compoundVariants: recipe.compoundVariants ? getSlotCompoundVariant(recipe.compoundVariants, slot) : []
  });
  const slots = recipe.slots ?? [];
  const recipeParts = slots.map((slot) => [slot, init(slot)]);
  for (const [variantsKey, variantsSpec] of Object.entries(recipe.variants ?? {})) {
    for (const [variantKey, variantSpec] of Object.entries(variantsSpec)) {
      recipeParts.forEach(([slot, slotRecipe]) => {
        slotRecipe.variants[variantsKey] ??= {};
        slotRecipe.variants[variantsKey][variantKey] = variantSpec[slot] ?? {};
      });
    }
  }
  return Object.fromEntries(recipeParts);
};
var getSlotCompoundVariant = (compoundVariants, slotName) => compoundVariants.filter((compoundVariant) => compoundVariant.css[slotName]).map((compoundVariant) => ({ ...compoundVariant, css: compoundVariant.css[slotName] }));

// src/split.ts
function splitBy(value, separator = ",") {
  const result = [];
  let current = "";
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === separator && depth === 0) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}
function splitDotPath(path) {
  return path.split(".").reduce((acc, curr) => {
    const last = acc[acc.length - 1];
    if (last != null && !isNaN(Number(last)) && !isNaN(Number(curr))) {
      acc[acc.length - 1] = `${last}.${curr}`;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);
}
function getNegativePath(path) {
  return path.slice(0, -1).concat(`-${path.at(-1)}`);
}
function getDotPath(obj, path, fallback) {
  if (typeof path !== "string")
    return fallback;
  const idx = path.indexOf(".");
  if (idx === -1) {
    return obj?.[path] ?? fallback;
  }
  const key = path.slice(0, idx);
  const nextPath = path.slice(idx + 1);
  const checkValue = obj?.[key]?.[nextPath];
  if (checkValue) {
    return checkValue;
  }
  return getDotPath(obj?.[key], nextPath, fallback) ?? fallback;
}

// src/split-props.ts
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props);
  const dKeys = Object.keys(descriptors);
  const split = (k) => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  const fn = (key) => split(Array.isArray(key) ? key : dKeys.filter(key));
  return keys.map(fn).concat(split(dKeys));
}

// src/to-json.ts
function mapToJson(map) {
  const obj = {};
  map.forEach((value, key) => {
    if (value instanceof Map) {
      obj[key] = Object.fromEntries(value);
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

// src/typegen.ts
function unionType(values) {
  return Array.from(values).map((value) => JSON.stringify(value)).join(" | ");
}

// src/uniq.ts
var uniq = (...items) => {
  const set = items.reduce((acc, currItems) => {
    if (currItems) {
      currItems.forEach((item) => acc.add(item));
    }
    return acc;
  }, /* @__PURE__ */ new Set([]));
  return Array.from(set);
};

// src/unit-conversion.ts
var BASE_FONT_SIZE = 16;
var UNIT_PX = "px";
var UNIT_EM = "em";
var UNIT_REM = "rem";
var DIGIT_REGEX = new RegExp(String.raw`-?\d+(?:\.\d+|\d*)`);
var UNIT_REGEX = new RegExp(`${UNIT_PX}|${UNIT_EM}|${UNIT_REM}`);
var VALUE_REGEX = new RegExp(`${DIGIT_REGEX.source}(${UNIT_REGEX.source})`);
function getUnit(value = "") {
  const unit = value.match(VALUE_REGEX);
  return unit?.[1];
}
function toPx(value = "") {
  if (typeof value === "number") {
    return `${value}px`;
  }
  const unit = getUnit(value);
  if (!unit)
    return value;
  if (unit === UNIT_PX) {
    return value;
  }
  if (unit === UNIT_EM || unit === UNIT_REM) {
    return `${parseFloat(value) * BASE_FONT_SIZE}${UNIT_PX}`;
  }
}
function toEm(value = "", fontSize = BASE_FONT_SIZE) {
  const unit = getUnit(value);
  if (!unit)
    return value;
  if (unit === UNIT_EM) {
    return value;
  }
  if (unit === UNIT_PX) {
    return `${parseFloat(value) / fontSize}${UNIT_EM}`;
  }
  if (unit === UNIT_REM) {
    return `${parseFloat(value) * BASE_FONT_SIZE / fontSize}${UNIT_EM}`;
  }
}
function toRem(value = "") {
  const unit = getUnit(value);
  if (!unit)
    return value;
  if (unit === UNIT_REM) {
    return value;
  }
  if (unit === UNIT_EM) {
    return `${parseFloat(value)}${UNIT_REM}`;
  }
  if (unit === UNIT_PX) {
    return `${parseFloat(value) / BASE_FONT_SIZE}${UNIT_REM}`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CacheMap,
  PANDA_CONFIG_NAME,
  PandaError,
  assign,
  astish,
  calc,
  camelCaseProperty,
  capitalize,
  compact,
  createCss,
  createMergeCss,
  createRegex,
  cssVar,
  dashCase,
  deepSet,
  entries,
  esc,
  filterBaseConditions,
  flatten,
  fromEntries,
  getArbitraryValue,
  getDotPath,
  getNegativePath,
  getOrCreateSet,
  getPatternStyles,
  getPropertyPriority,
  getSlotCompoundVariant,
  getSlotRecipes,
  getUnit,
  hypenateProperty,
  isBaseCondition,
  isBoolean,
  isCssFunction,
  isCssUnit,
  isCssVar,
  isFunction,
  isImportant,
  isObject,
  isObjectOrArray,
  isString,
  mapEntries,
  mapObject,
  mapToJson,
  markImportant,
  memo,
  mergeProps,
  mergeWith,
  normalizeStyleObject,
  omit,
  parseJson,
  patternFns,
  splitBy,
  splitDotPath,
  splitProps,
  stringifyJson,
  toEm,
  toHash,
  toPx,
  toRem,
  toResponsiveObject,
  traverse,
  uncapitalize,
  unionType,
  uniq,
  walkObject,
  withoutImportant,
  withoutSpace
});
