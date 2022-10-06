import type IStaticAlgorithmDescription from "./IStaticAlgorithmDescription";
import type { IMemory } from "../use_case/MemoryWriteSync";

interface IAlgorithmDef extends IStaticAlgorithmDescription {
  process_count: number;
  algorithm_impl_url: URL;
  prefix: string;
  get_memory: (process_count: number) => IMemory;
  source_code: [number, string][];
}
export default IAlgorithmDef;