import * as _pandacss_types from '@pandacss/types';
import { Config, ConfigTsOptions, LoadConfigResult } from '@pandacss/types';
export { diffConfigs } from './diff-config.js';
import { P as PathMapping } from './ts-config-paths-qwrwgu2Q.js';
export { c as convertTsPathsToRegexes } from './ts-config-paths-qwrwgu2Q.js';
import { TSConfig } from 'pkg-types';
export { mergeConfigs } from './merge-config.js';

interface ConfigFileOptions {
    cwd: string;
    file?: string;
}
interface BundleConfigResult<T = Config> {
    config: T;
    dependencies: string[];
    path: string;
}

declare function bundleConfig(options: ConfigFileOptions): Promise<BundleConfigResult>;

declare function findConfig(options: Partial<ConfigFileOptions>): string;

interface GetDepsOptions {
    filename: string;
    ext: string;
    cwd: string;
    seen: Set<string>;
    baseUrl: string | undefined;
    pathMappings: PathMapping[];
    foundModuleAliases: Map<string, string>;
    compilerOptions?: TSConfig['compilerOptions'];
}
declare function getConfigDependencies(filePath: string, tsOptions?: ConfigTsOptions, compilerOptions?: TSConfig['compilerOptions']): {
    deps: Set<string>;
    aliases: Map<string, string>;
};

type Extendable<T> = T & {
    extend?: T;
};
type ExtendableConfig = Extendable<Config>;
/**
 * Recursively merge all presets into a single config (depth-first using stack)
 */
declare function getResolvedConfig(config: ExtendableConfig, cwd: string): Promise<Config>;

/**
 * Find, load and resolve the final config (including presets)
 */
declare function loadConfig(options: ConfigFileOptions): Promise<_pandacss_types.LoadConfigResult>;

/**
 * Resolve the final config (including presets)
 * @pandacss/preset-base: ALWAYS included if NOT using eject: true
 * @pandacss/preset-panda: only included by default if no presets
 */
declare function resolveConfig(result: BundleConfigResult, cwd: string): Promise<LoadConfigResult>;

export { type BundleConfigResult, type GetDepsOptions, bundleConfig, findConfig, getConfigDependencies, getResolvedConfig, loadConfig, resolveConfig };
