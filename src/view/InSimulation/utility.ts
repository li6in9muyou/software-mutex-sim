import { readable } from "svelte/store";
import { random } from "lodash";

export const mockLineno = (pc) =>
  ((process_count) => {
    const init_lineno: number[] = new Array(process_count).fill(0);
    return readable(init_lineno, (set) => {
      const i = setInterval(() => {
        init_lineno.map((_, idx) => {
          init_lineno[idx] += random(1, 3);
          init_lineno[idx] %= 7;
          return init_lineno[idx];
        });
        set(init_lineno);
      }, 500);
      return () => clearInterval(i);
    });
  })(pc);
