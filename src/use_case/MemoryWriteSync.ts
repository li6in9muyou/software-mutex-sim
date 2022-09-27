import { get, type Readable, writable } from "svelte/store";
import { identity, isFunction, isUndefined } from "lodash";
import debug from "debug";
import type { Subject } from "threads/observable";

export type IMemory = { [key: string]: Int32Array };

type MemorySyncMessage = [string, Array<number>];

export function useMonitoredMemory(
  sync: Subject<MemorySyncMessage>,
  mem: IMemory
) {
  function build_proxy_handler_for_key(slice: string) {
    return {
      set(buffer: Int32Array, index: string, value: number) {
        buffer[Number(index)] = value;
        sync.next([slice, Array.from(buffer)]);
        return true;
      },
      get(buffer: Int32Array, index: number) {
        const element = buffer[index];
        if (isFunction(element)) {
          return element.bind(buffer);
        } else {
          return element;
        }
      },
    };
  }

  const monitored = {} as IMemory;
  for (const slice in mem) {
    monitored[slice] = new Proxy(
      mem[slice],
      // @ts-ignore
      build_proxy_handler_for_key(slice)
    );
    sync.next([slice, Array.from(mem[slice])]);
  }
  return monitored;
}

export function createMemorySyncStoreAndSync(memory: IMemory) {
  const d = debug("memory sync handler");
  const stores = writable({});
  for (const storeLabel of Object.keys(memory)) {
    stores.update((prev) => ({
      ...prev,
      [storeLabel]: writable<Array<number>>([]),
    }));
  }
  return [
    stores,
    (msg: MemorySyncMessage) => {
      const [which, array] = msg;
      const s = get(stores);

      d("attempting to update store %s %o", which, array);
      if (!isUndefined(s[which])) {
        s[which].set(array);
        stores.set(s);
        d("success");
      } else {
        d("segment fault %s", which);
      }
    },
  ];
}

export function make_identity_trans(s) {
  const ans = {};
  for (const sKey in s) {
    ans[sKey] = identity;
  }
  return ans;
}

export type MemorySliceStores = Readable<{
  [key: string]: Readable<Array<number>>;
}>;

export type MemorySliceTransformers = { [key: string]: (number) => string };
