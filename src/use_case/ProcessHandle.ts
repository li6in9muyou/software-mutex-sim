export default interface IProcessHandle {
  run: () => void;
  resume: (pid: number) => void;
  pause: (pid: number) => void;
}
