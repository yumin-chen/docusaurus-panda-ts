"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
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

// src/diff-config.ts
var diff_config_exports = {};
__export(diff_config_exports, {
  diffConfigs: () => diffConfigs
});
module.exports = __toCommonJS(diff_config_exports);
var import_shared = require("@pandacss/shared");
var import_microdiff = __toESM(require("microdiff"));

// src/create-matcher.ts
function createMatcher(id, patterns) {
  if (!patterns?.length)
    return () => void 0;
  const includePatterns = [];
  const excludePatterns = [];
  const deduped = new Set(patterns);
  deduped.forEach((pattern) => {
    const regexString = pattern.replace(/\*/g, ".*");
    if (pattern.startsWith("!")) {
      excludePatterns.push(regexString.slice(1));
    } else {
      includePatterns.push(regexString);
    }
  });
  const include = new RegExp(includePatterns.join("|"));
  const exclude = new RegExp(excludePatterns.join("|"));
  return (path) => {
    if (excludePatterns.length && exclude.test(path))
      return;
    return include.test(path) ? id : void 0;
  };
}

// src/config-deps.ts
var all = [
  "clean",
  "cwd",
  "eject",
  "outdir",
  "forceConsistentTypeExtension",
  "outExtension",
  "emitTokensOnly",
  "presets",
  "plugins",
  "hooks"
];
var format = [
  "syntax",
  "hash",
  "prefix",
  "separator",
  "strictTokens",
  "strictPropertyValues",
  "shorthands"
];
var tokens = [
  "utilities",
  "conditions",
  "theme.tokens",
  "theme.semanticTokens",
  "theme.breakpoints",
  "theme.containerNames",
  "theme.containerSizes"
];
var jsx = ["jsxFramework", "jsxFactory", "jsxStyleProps", "syntax"];
var common = tokens.concat(jsx, format);
var artifactConfigDeps = {
  helpers: ["syntax", "jsxFramework"],
  keyframes: ["theme.keyframes", "layers"],
  "design-tokens": ["layers", "!utilities.*.className"].concat(tokens),
  types: ["!utilities.*.className"].concat(common),
  "css-fn": common,
  cva: ["syntax"],
  sva: ["syntax"],
  cx: [],
  "create-recipe": ["separator", "prefix", "hash"],
  "recipes-index": ["theme.recipes", "theme.slotRecipes"],
  recipes: ["theme.recipes", "theme.slotRecipes"],
  "patterns-index": ["syntax", "patterns"],
  patterns: ["syntax", "patterns"],
  "jsx-is-valid-prop": common,
  "jsx-factory": jsx,
  "jsx-helpers": jsx,
  "jsx-patterns": jsx.concat("patterns"),
  "jsx-patterns-index": jsx.concat("patterns"),
  "css-index": ["syntax"],
  "package.json": ["forceConsistentTypeExtension", "outExtension"],
  "types-styles": ["shorthands"],
  "types-conditions": ["conditions"],
  "types-jsx": jsx,
  "types-entry": [],
  "types-gen": [],
  "types-gen-system": [],
  themes: ["themes"].concat(tokens)
};
var artifactMatchers = Object.entries(artifactConfigDeps).map(([key, paths]) => {
  if (!paths.length)
    return () => void 0;
  return createMatcher(key, paths.concat(all));
});

// src/diff-config.ts
var runIfFn = (fn) => typeof fn === "function" ? fn() : fn;
function diffConfigs(config, prevConfig) {
  const affected = {
    artifacts: /* @__PURE__ */ new Set(),
    hasConfigChanged: false,
    diffs: []
  };
  if (!prevConfig) {
    affected.hasConfigChanged = true;
    return affected;
  }
  const configDiff = (0, import_microdiff.default)(prevConfig, runIfFn(config));
  if (!configDiff.length) {
    return affected;
  }
  affected.hasConfigChanged = true;
  affected.diffs = configDiff;
  configDiff.forEach((change) => {
    const changePath = change.path.join(".");
    artifactMatchers.forEach((matcher) => {
      const id = matcher(changePath);
      if (!id)
        return;
      if (id === "recipes") {
        const name = (0, import_shared.dashCase)(change.path.slice(1, 3).join("."));
        affected.artifacts.add(name);
      }
      if (id === "patterns") {
        const name = (0, import_shared.dashCase)(change.path.slice(0, 2).join("."));
        affected.artifacts.add(name);
      }
      affected.artifacts.add(id);
    });
  });
  return affected;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  diffConfigs
});
