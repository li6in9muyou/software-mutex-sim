import type { Readable } from "svelte/store";
import type IProgram from "./IProgram";

export enum ProcessLifeCycle {
  ready,
  running,
  paused,
  completed,
}

export interface IProcessQuery {
  execution_state: Readable<ProcessLifeCycle>;
  program: IProgram;
}

export default interface IProcess {
  start(): Promise<void>;
  resume(): Promise<void>;
  pause(): Promise<void>;
  kill(): Promise<void>;
}
