import { derived, get, writable } from "svelte/store";
import { isEmpty } from "lodash";

export type Pages = "AlgoSelection" | "AlgoConfig" | "InSimulation";

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

let history: Pages[] = [];
export const router = {
  push(page: Pages) {
    history.push(get(CurrentPage));
    CurrentPage.set(page);
  },
  pop() {
    if (!isEmpty(history)) {
      CurrentPage.set(history.pop());
    }
  },
};
