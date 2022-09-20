import { derived, writable } from "svelte/store";
type Pages = "AlgoSelection" | "AlgoConfig" | "InSimulation";

export const CurrentPage = writable<Pages>("AlgoSelection");

export const onAlgoSelectionPage = derived(
  CurrentPage,
  (p) => p === "AlgoSelection"
);

export const onInSimulationPage = derived(
  CurrentPage,
  (p) => p === "InSimulation"
);

export const onAlgoConfigPage = derived(CurrentPage, (p) => p === "AlgoConfig");
