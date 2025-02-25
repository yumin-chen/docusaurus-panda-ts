export { AGENTS, Agent, LOCKS } from './agents.cjs';

interface DetectOptions {
    cwd?: string;
}

declare function detect({ cwd }?: DetectOptions): Promise<{
    agent: "npm" | "yarn" | "yarn@berry" | "pnpm" | "pnpm@6" | "bun" | undefined;
    version: string | undefined;
}>;

export { type DetectOptions, detect };
