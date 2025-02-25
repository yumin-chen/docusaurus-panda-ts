import type { Database } from '@tinacms/graphql';
import { ConfigManager } from '../../../config-manager';
export declare const createDevServer: (configManager: ConfigManager, database: Database, searchIndex: any, apiURL: string, noWatch: boolean, databaseLock: (fn: () => Promise<void>) => Promise<void>) => Promise<import("vite").ViteDevServer>;
