export default interface IProcessHandle {
  runAll: () => void;
  runOne: (pid: number) => void;
  resume: (pid: number) => void;
  pause: (pid: number) => void;
}

export interface ISingleProcessHandle {
  run: () => void;
  resume: () => void;
  pause: () => void;
}
