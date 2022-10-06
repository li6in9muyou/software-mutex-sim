import type IProcess from "./IProcess";

export default interface IProcessGroup {
  all: IProcess;
  pid(pid: number): IProcess;
}
