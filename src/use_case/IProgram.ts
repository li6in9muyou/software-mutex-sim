import type { Readable } from "svelte/store";

export enum LockingState {
  Locking,
  Locked,
  Unlocking,
  Unlocked,
}

export default interface IProgram {
  locking_state: Readable<LockingState> | null;
  line_number: Readable<number> | null;
}
