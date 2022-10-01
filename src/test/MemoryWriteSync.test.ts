import { beforeEach, describe, it, expect } from "vitest";
import { Observable, Subject } from "threads/observable";
import {
  createMemorySyncStoreAndSync,
  type MemorySyncMessage,
} from "../use_case/MemoryWriteSync";
import { get } from "svelte/store";

describe("MemoryWriteSync", () => {
  let source: Subject<any>;
  let ob: Observable<MemorySyncMessage>;

  beforeEach(() => {
    source = new Subject();
    ob = Observable.from(source);
  });

  it("should not throw if source emits unexpected event", () => {
    const [_, m] = createMemorySyncStoreAndSync({
      test: new Int32Array(1),
    });

    ob.subscribe(m as (ev: MemorySyncMessage) => void);

    source.next({});
    source.next(["weired event", 99]);
    source.next([99, "post"]);
    source.next(["post", [1, 2]]);
    source.next(["post", 99, 999]);
    source.next(99);
    source.next(undefined);
    source.next(null);
  });

  it("should update store", () => {
    const [stores, m] = createMemorySyncStoreAndSync({
      test: new Int32Array(1),
    });

    ob.subscribe(m as (ev: MemorySyncMessage) => void);

    expect(get(get(stores)["test"])).toEqual([0]);
    source.next(["test", [3, 4, 5]]);
    expect(get(get(stores)["test"])).toEqual([3, 4, 5]);
  });
});
