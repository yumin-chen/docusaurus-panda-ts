import * as _pandacss_types from '@pandacss/types';
import { LogLevel, LogEntry } from '@pandacss/types';
export { default as colors } from 'kleur';

interface LoggerConfig {
    level?: LogLevel;
    filter?: string;
    isDebug?: boolean;
    onLog?: (entry: LogEntry) => void;
}

declare const quote: (...str: string[]) => string;
declare const logger: _pandacss_types.LoggerInterface;

export { type LoggerConfig, logger, quote };
