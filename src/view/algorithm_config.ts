import { derived, writable } from "svelte/store";
import type IAlgorithmDef from "../algorithms/IAlgorithmDef";
import type IStaticAlgorithmDescription from "../algorithms/IStaticAlgorithmDescription";
import AlgorithmTable from "../algorithms/AlgorithmTable";
import { isUndefined } from "lodash";

export const StaticDescription = writable<IStaticAlgorithmDescription>();

export const ProcessCount = writable<number>(2);

export const CurrentSelectedAlgorithm = derived<
  [typeof StaticDescription, typeof ProcessCount],
  IAlgorithmDef
>([StaticDescription, ProcessCount], (stores, set) => {
  const [sd, pc] = stores;
  if (isUndefined(sd)) {
    set(null);
  } else {
    set({
      ...sd,
      ...AlgorithmTable.get(sd.name),
      process_count: pc,
    });
  }
});
