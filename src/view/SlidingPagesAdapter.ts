import {
  onAlgoConfigPage,
  onAlgoSelectionPage,
  onInSimulationPage,
} from "./model";
import { derived } from "svelte/store";

export default derived(
  [onAlgoSelectionPage, onAlgoConfigPage, onInSimulationPage],
  ([l, m, r], set) => {
    if (l) {
      set(0);
    } else if (m) {
      set(1);
    } else if (r) {
      set(2);
    } else {
      throw new Error("It's on none of these three pages");
    }
  }
);
