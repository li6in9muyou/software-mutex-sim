export default interface IProcessHandle {
  runAll: () => void;
  runOne: (pid: number) => void;
  resume: (pid: number) => void;
  pause: (pid: number) => void;
}
