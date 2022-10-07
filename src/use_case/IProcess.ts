import type { Readable } from "svelte/store";
import type IProgram from "./IProgram";
import type { ProcessLifeCycle } from "./IProcessLifeCycle";

export interface IProcessQuery {
  pid: number;
  execution_state: Readable<ProcessLifeCycle>;
  program: IProgram;
}

export interface IProcessCommand {
  start(): Promise<void>;
  resume(): Promise<void>;
  pause(): Promise<void>;
  kill(): Promise<void>;
}

export default interface IProcess extends IProcessCommand, IProcessQuery {}
