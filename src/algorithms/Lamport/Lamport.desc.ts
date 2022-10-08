import type IAlgorithmDef from "../IAlgorithmDef";
import { TRUE, FALSE } from "./constants";
import LamportDescriptionText from "./description.txt?raw";

export default <IAlgorithmDef>{
  source_code: [
    [1, "flag[pid] = TRUE;"],
    [2, "label[pid] = max(label) + 1;"],
    [3, "do {"],
    [51, ""],
    [-1, "} while (should_wait(pid, label, flag));"],
    [4, "<<critical region>>"],
    [5, "flag[who] = FALSE;"],
  ],
  process_count: 4,
  name: "Lamport's Algorithm",
  description: LamportDescriptionText,
  memory_transform: (v: number) => {
    switch (v) {
      case TRUE: {
        return "TRUE";
      }
      case FALSE: {
        return "FALSE";
      }
      default:
        return v.toString();
    }
  },
  algorithm_impl_url: new URL("./Lamport-tk2.ts", import.meta.url),
  get_memory: (process_count) => ({
    flag: new Int32Array(new SharedArrayBuffer(4 * process_count)).fill(FALSE),
    label: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  }),
};
