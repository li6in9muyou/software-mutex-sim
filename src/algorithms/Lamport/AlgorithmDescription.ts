import type IAlgorithmDef from "../IAlgorithmDef";
import { Lamport } from "./constants";
import { FALSE } from "../Dekker/constants";
import source_code from "./source_code";

const process_count = 4;

const d: IAlgorithmDef = {
  source_code,
  process_count,
  ...Lamport,
  algorithm_impl_url: new URL("./Lamport-tk2.ts", import.meta.url),
  prefix: "Lamport",
  get_memory: (process_count) => ({
    flag: new Int32Array(new SharedArrayBuffer(4 * process_count)).fill(FALSE),
    label: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  }),
};
export default d;
