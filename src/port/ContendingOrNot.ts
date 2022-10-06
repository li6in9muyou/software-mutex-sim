import type { SveltePort } from "./SveltePort";
import debug from "debug";
import type { Readable } from "svelte/store";
import { isArray } from "lodash";
import type { Observable } from "threads/observable";

export type ContendingOrNotEvent = ["pre" | "post", number];

export default class ContendingOrNot {
  public readonly debug_message_handler: (...args: any[]) => void;

  constructor(private readonly port: SveltePort) {
    this.debug_message_handler = debug(`ContendingOrNot:Debug`);
  }

  attach(source: Observable<ContendingOrNotEvent>) {
    source.subscribe(this.core_message_handler);
  }

  get core_message_handler(): (msg: any) => void {
    return (msg) => {
      if (isArray(msg) && msg.length === 2) {
        this.debug_message_handler("core msg %o", msg);
        const [when, who] = msg;
        switch (when) {
          case "pre": {
            return this.port.pre_critical_region(who);
          }
          case "post": {
            return this.port.post_critical_region(who);
          }
        }
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
