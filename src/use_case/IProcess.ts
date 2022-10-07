import type { Readable } from "svelte/store";

export enum ProcessState {
  ready,
  running,
  paused,
  completed,
}

export interface IProcessStore {
  execution_state: Readable<ProcessState>;
}

export default interface IProcess {
  start(): Promise<void>;
  resume(): Promise<void>;
  pause(): Promise<void>;
  kill(): Promise<void>;
}
