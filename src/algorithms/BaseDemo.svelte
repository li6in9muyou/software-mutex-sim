<script lang="ts">
  import { get, writable } from "svelte/store";
  import StartManyProcesses from "../use_case/StartManyProcesses";
  import debug from "debug";
  import { SveltePort } from "../SveltePort";
  import { capitalize, isUndefined, range } from "lodash";
  import PausePlease from "../PausePlease.svelte";
  import type { IMemory } from "../use_case/BaseProcess";

  export let process_count: number;
  export let algorithm_impl_url: URL;
  export let prefix: string;
  export let memory: IMemory;

  const d = debug(`BaseDemo:${capitalize(prefix)}:Debug`);

  const stores = writable({});
  for (const storeLabel of Object.keys(memory)) {
    stores.update((prev) => ({
      ...prev,
      [storeLabel]: writable<Array<number>>([]),
    }));
  }
  d("created stores %o", get(stores));
  const m = (msg) => {
    const [which, array] = msg;
    d("attempting to update store %s %o", which, array);
    if (!isUndefined($stores[which])) {
      $stores[which].set(array);
      $stores = $stores;
      d("success");
    } else {
      d("segment fault %s", which);
    }
  };

  const port = new SveltePort(process_count);
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.is_process_in_critical_region;

  const c = (msg) => {
    const [when, who] = msg;
    d("core msg %o", msg);
    if (when === "pre") {
      port.pre_critical_region(who);
    } else {
      port.post_critical_region(who);
    }
  };
  const dd = new StartManyProcesses(process_count, algorithm_impl_url, c, m, d);
  d("Start Many Processes %O", dd);
  const resume = dd.resume_by_pid.bind(dd);
  const pause = dd.pause_by_pid.bind(dd);
</script>

<section>
  <h1>BaseDemo {capitalize(prefix)}'s Algorithm</h1>
  <button on:click={() => dd.run(memory, process_count)}>start</button>
  <h2>Pause</h2>
  <p>
    {#each range(0, process_count) as pid}
      <PausePlease {pid} {prefix} {resume} {pause} />
    {/each}
  </p>
  <h2>Global Memory</h2>
  {#each Object.keys(memory) as label}
    <p>{label}: {get($stores[label])}</p>
  {/each}
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
