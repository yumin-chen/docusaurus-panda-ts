// src/diff-config.ts
import { dashCase } from "@pandacss/shared";
import microdiff from "microdiff";

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
  const configDiff = microdiff(prevConfig, runIfFn(config));
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
        const name = dashCase(change.path.slice(1, 3).join("."));
        affected.artifacts.add(name);
      }
      if (id === "patterns") {
        const name = dashCase(change.path.slice(0, 2).join("."));
        affected.artifacts.add(name);
      }
      affected.artifacts.add(id);
    });
  });
  return affected;
}

export {
  diffConfigs
};
