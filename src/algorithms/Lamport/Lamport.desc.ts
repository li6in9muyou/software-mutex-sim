import L from "./Lamport-tk2?worker";
import type IAlgorithmDef from "../IAlgorithmDef";
import { TRUE, FALSE, NO_TICKET } from "./constants";
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
      case NO_TICKET: {
        return "X";
      }
      default:
        return v.toString();
    }
  },
  algorithm_impl_builder: () => new L(),
  get_memory: (process_count) => ({
    flag: new Array(process_count).fill(FALSE),
    label: new Array(process_count).fill(NO_TICKET),
  }),
};
