import { vi, beforeEach, describe, expect, it } from "vitest";
import { Observable, Subject } from "threads/observable";
import ContendingOrNot, {
  type ContendingOrNotEvent,
} from "../port/ContendingOrNot";
import type { SveltePort } from "../SveltePort";

describe("ContendingOrNot", () => {
  let source: Subject<ContendingOrNotEvent>;
  let port: SveltePort;

  beforeEach(() => {
    source = new Subject();
    port = {
      pre_critical_region: vi.fn(),
      post_critical_region: vi.fn(),
    } as unknown as SveltePort;
  });

  it("should have an attach methods that accepts an Observable", () => {
    const con = new ContendingOrNot("Testing", port);

    con.attach(Observable.from(source));

    source.next(["pre", 99]);
    source.next(["post", 99]);
    expect(port.pre_critical_region).toBeCalledWith(99);
    expect(port.pre_critical_region).toBeCalledWith(99);
  });

  it("should provides an event handler", () => {
    const con = new ContendingOrNot("Testing", port);

    source.subscribe(con.core_message_handler);

    source.next(["pre", 99]);
    source.next(["post", 99]);
    expect(port.pre_critical_region).toBeCalledWith(99);
    expect(port.pre_critical_region).toBeCalledWith(99);
  });

  it("should not throw if source emits unexpected event", () => {
    const con = new ContendingOrNot("Testing", port);

    con.attach(Observable.from(source));
    source.subscribe(con.core_message_handler);

    source.next({} as unknown as ContendingOrNotEvent);
    source.next(["weired event", 99] as unknown as ContendingOrNotEvent);
    source.next([99, "post"] as unknown as ContendingOrNotEvent);
    source.next(["post", 99, 999] as unknown as ContendingOrNotEvent);
    source.next(99 as unknown as ContendingOrNotEvent);
    source.next(undefined as unknown as ContendingOrNotEvent);
    source.next(null as unknown as ContendingOrNotEvent);

    expect(port.pre_critical_region).toHaveBeenCalledTimes(0);
    expect(port.post_critical_region).toHaveBeenCalledTimes(0);
  });
});
