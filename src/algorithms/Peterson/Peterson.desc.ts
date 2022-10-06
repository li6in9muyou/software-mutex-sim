import type IAlgorithmDef from "../IAlgorithmDef";
import Desc from "./description.txt?raw";
import { identity } from "lodash";

export default <IAlgorithmDef>{
  source_code: [
    [1, "for (let i = 1; i < process_count; i++) {"],
    [2, "  level[pid] = i;"],
    [3, "  victim[i] = pid;"],
    [4, "  do {"],
    [100, ""],
    [5, "  } while (!can_proceed(pid, i, level, victim));"],
    [6, "}"],
    [101, "<<critical region>>"],
    [7, "level[who] = 0;"],
    [102, "<<DONE>>"],
  ],
  process_count: 4,
  name: "Peterson's Algorithm",
  description: Desc,
  memory_transform: identity,
  algorithm_impl_url: new URL("./Peterson-tk2.ts", import.meta.url),
  get_memory: (process_count) => ({
    level: new Int32Array(new SharedArrayBuffer(4 * process_count)),
    victim: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  }),
};
