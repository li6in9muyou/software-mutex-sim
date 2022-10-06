export default interface IProcess {
  start: () => Promise<void>;
  resume: () => Promise<void>;
  pause: () => Promise<void>;
  kill: () => Promise<void>;
}
