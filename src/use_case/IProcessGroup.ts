import type IProcess from "./IProcess";
import type { IProcessStore } from "./IProcess";
import type { Readable } from "svelte/store";

interface IProcessGroupStore {
  execution_state: IProcessStore[] | null;
}

export default interface IProcessGroup {
  all: IProcessGroupStore & IProcess;
  memory: Map<string, Readable<Array<number>>>;
  pid(pid: number): IProcess;
}
