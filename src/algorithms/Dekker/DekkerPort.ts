import { get, writable } from "svelte/store";
import { counterpart } from "./Dekker";

export const turn_store = writable(0);

export const wants_to_enter_store = writable([false, false]);

export default (id) => ({
  if_my_turn() {
    return get(turn_store) === id;
  },
  flip_turn() {
    turn_store.set(counterpart(id));
  },
  set_my_interests: () =>
    wants_to_enter_store.update((w) => {
      w[id] = true;
      return w;
    }),
  clear_my_interests: () =>
    wants_to_enter_store.update((w) => {
      w[id] = false;
      return w;
    }),
  if_counterpart_interests: () =>
    get(wants_to_enter_store)[counterpart(id)] === true,
});
