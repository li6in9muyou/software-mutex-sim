import { SveltePort } from "../SveltePort";
import debug from "debug";
import type { Readable } from "svelte/store";
import { capitalize } from "lodash";

export default class ContendingOrNot {
  private readonly port: SveltePort;
  public readonly debug_message_handler: (...args: any[]) => void;

  constructor(private readonly name: string, process_count: number) {
    this.port = new SveltePort(process_count);
    this.debug_message_handler = debug(
      `ContendingOrNot:${capitalize(this.name)}:Debug`
    );
  }

  get core_message_handler(): (msg: any) => void {
    return (msg) => {
      const [when, who] = msg;
      this.debug_message_handler("core msg %o", msg);
      if (when === "pre") {
        this.port.pre_critical_region(who);
      } else {
        this.port.post_critical_region(who);
      }
    };
  }

  get_stores_overview_contending_acquired(): [
    Readable<boolean[]>,
    Readable<number[]>,
    Readable<number[]>
  ] {
    return [
      this.port.is_process_in_critical_region,
      this.port.those_contending,
      this.port.those_in_critical_region,
    ];
  }
}
