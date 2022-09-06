import { use_critical_region } from "../../SveltePort";
import { Idle, Yield } from "../../utility";
import portBuilder from "./DekkerPort";

export function counterpart(id) {
  return id === 1 ? 0 : 1;
}

const critical_region = (visitor) =>
  use_critical_region(visitor)(async () => {
    await Idle();
  });

async function process_x(id) {
  const port = portBuilder(id);

  port.set_my_interests();
  while (port.if_counterpart_interests()) {
    if (!port.if_my_turn()) {
      port.clear_my_interests();
      while (!port.if_my_turn()) {
        await Yield();
        // busy waiting
      }
      port.set_my_interests();
    }
  }
  await critical_region(id)(id);
  port.flip_turn();
  port.clear_my_interests();
}

export const process_zero = () => process_x(0);
export const process_one = () => process_x(1);
