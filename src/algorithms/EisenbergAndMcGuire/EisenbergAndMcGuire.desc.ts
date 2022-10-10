import E from "./EisenbergAndMcGuire-tk2?worker";
import type IAlgorithmDef from "../IAlgorithmDef";
import Desc from "./description.txt?raw";
import { IDLE, IN_CS, WANT_IN } from "./constants";

export default <IAlgorithmDef>{
  algorithm_impl_builder: () => new E(),
  description: Desc,
  get_memory: (process_count: number) => ({
    flag: new Array(process_count).fill(0),
    turn: [0],
  }),
  memory_transform: (v: number) => {
    switch (v) {
      case WANT_IN: {
        return "WANT_IN";
      }
      case IDLE: {
        return "IDLE";
      }
      case IN_CS: {
        return "IN_CS";
      }
      default:
        return v.toString();
    }
  },
  name: "Eisenberg/McGuire's Algorithm",
  process_count: 5,
  source_code: [
    [0, "const i = who;"],
    [1, "let j;"],
    [2, "do {"],
    [3, "  flag[i] = WANT_IN;"],
    [4, "  j = turn[0];"],
    [5, "  while (j != i) {"],
    [6, "    if (flag[j] != IDLE) {"],
    [7, "      j = turn[0];"],
    [8, "    } else {"],
    [9, "      j += 1;"],
    [10, "      j %= process_count;"],
    [11, "    }"],
    [12, "  }"],
    [13, "  flag[i] = IN_CS;"],
    [14, "  j = 0;"],
    [
      15,
      "  while (\n    j < process_count \n    && (j === i || flag[j] !== IN_CS)\n  ) {",
    ],
    [16, "    j += 1;"],
    [17, "  }"],
    [
      18,
      "  if (\n    j >= process_count \n    && (\n      turn[0] == i \n      || flag[turn[0]] == IDLE\n    )\n  ) {",
    ],
    [19, "    break;"],
    [20, "  }"],
    [21, "} while (true);"],
    [22, "turn[0] = i;"],
    [101, "<<critical region>>"],
    [50, "let pid = (turn[0] + 1) % process_count;"],
    [51, "while (true) {"],
    [52, "  pid += 1;"],
    [53, "  pid %= process_count;"],
    [54, "  if (flag[pid] !== IDLE) {"],
    [55, "    break;"],
    [56, "  }"],
    [57, "}"],
    [58, "turn[0] = pid;"],
    [59, "flag[who] = IDLE;"],
    [102, "<<DONE>>"],
  ],
};
