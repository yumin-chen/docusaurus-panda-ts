import { Config, DiffConfigResult } from '@pandacss/types';

type ConfigOrFn = Config | (() => Config);
/**
 * Diff the two config objects and return the list of affected properties
 */
declare function diffConfigs(config: ConfigOrFn, prevConfig: Config | undefined): DiffConfigResult;

export { diffConfigs };
