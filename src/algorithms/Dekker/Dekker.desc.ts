import D from "./Dekker-tk2?worker";
import type IAlgorithmDef from "../IAlgorithmDef";
import Desc from "./description.txt?raw";
import { FALSE, TRUE } from "./constants";

export default <IAlgorithmDef>{
  source_code: [
    [1, "wants_to_enter[who] = TRUE;"],
    [2, "while (\n  TRUE === \n  wants_to_enter[counterpart(who)]\n) {"],
    [4, "  if (turn[0] !== who) {"],
    [6, "    wants_to_enter[who] = FALSE;"],
    [7, "    while (turn[0] !== who) {"],
    [8, "      // busy waiting"],
    [-1, "    }"],
    [9, "    wants_to_enter[who] = TRUE;"],
    [-2, "  }"],
    [-3, "}"],
    [101, "<<critical region>>"],
    [51, "wants_to_enter[who] = FALSE;"],
    [52, "turn[0] = counterpart(who);"],
    [102, "<<DONE>>"],
  ],
  process_count: 2,
  max_process_count: 2,
  name: "Dekker's Algorithm",
  description: Desc,
  memory_transform: (v: number) => {
    switch (v) {
      case TRUE: {
        return "YES";
      }
      case FALSE: {
        return "NO";
      }
      default:
        return v.toString();
    }
  },
  algorithm_impl_builder: () => new D(),
  get_memory: (process_count) => ({
    wants_to_enter: new Array(process_count).fill(FALSE),
    turn: [1],
  }),
};
