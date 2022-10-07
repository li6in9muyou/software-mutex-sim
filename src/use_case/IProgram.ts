import type { Readable } from "svelte/store";

export enum LockingState {
  Locking = "Locking",
  Locked = "Locked",
  Unlocking = "Unlocking",
  Unlocked = "Unlocked",
}

export default interface IProgram {
  locking_state: Readable<LockingState>;
  line_number: Readable<number>;
}
