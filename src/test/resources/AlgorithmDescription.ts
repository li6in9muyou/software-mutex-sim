import type IAlgorithmDef from "../../algorithms/IAlgorithmDef";
import type { IMemory } from "../../use_case/MemoryWriteSync";
import { identity } from "lodash";

const AlgorithmDescription: IAlgorithmDef = {
  algorithm_impl_url: new URL("./FakeAlgorithm.ts", import.meta.url),
  get_memory(): IMemory {
    return { what: new Int32Array(4) };
  },
  memory_transform: identity,
  name: "Crap",
  prefix: "Crap",
  process_count: 2,
  source_code: [],
};

export default AlgorithmDescription;
