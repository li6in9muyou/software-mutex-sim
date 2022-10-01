import { describe, it, expect, beforeEach } from "vitest";
import RunningSync, {
  ProcessState,
  type RunningSyncEvent,
} from "../use_case/RunningSync";
import { Observable, Subject } from "threads/observable";
import { get } from "svelte/store";
import { constant, every, times } from "lodash";

describe("RunningSync", () => {
  let source: Subject<RunningSyncEvent>;
  beforeEach(() => {
    source = new Subject();
  });

  it("should init every running to paused", () => {
    const rs = new RunningSync(3, Observable.from(source));
    expect(rs).toBeTruthy();
    expect(get(rs.running)).toEqual(times(3, constant(ProcessState.paused)));
  });

  it("should update running state", () => {
    const rs = new RunningSync(3, Observable.from(source));
    expect(rs).toBeTruthy();
    expect(rs.running.subscribe).toBeTypeOf("function");

    source.next({ type: "paused", payload: 0 });
    expect(get(rs.running)[0]).toEqual(ProcessState.paused);
    source.next({ type: "running", payload: 1 });
    expect(get(rs.running)[1]).toEqual(ProcessState.running);
  });

  it("should init all lineno to zero", () => {
    const rs = new RunningSync(10, Observable.from(source));
    expect(rs).toBeTruthy();
    expect(rs.lineno.subscribe).toBeTypeOf("function");
    expect(every(get(rs.lineno), (v) => v === 0)).toEqual(true);
  });

  it("should update lineno", () => {
    const rs = new RunningSync(10, Observable.from(source));
    source.next({ type: "lineno", payload: { pid: 1, lineno: 999 } });
    expect(get(rs.lineno)[1]).toEqual(999);
  });
});
