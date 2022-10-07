import type IProcess from "./IProcess";
import type { Readable } from "svelte/store";
import type IProgram from "./IProgram";
import type { ProcessLifeCycle } from "./IProcess";

export interface IProcessGroupQuery {
  execution_state: Readable<ProcessLifeCycle>[];
  program: IProgram[];
}

export default interface IProcessGroup {
  all: IProcessGroupQuery & IProcess;
  memory: Map<string, Readable<Array<number>>>;
  process_count: number;
  pid(pid: number): IProcess;
}
