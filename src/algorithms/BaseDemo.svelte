<script lang="ts">
  import { get } from "svelte/store";
  import StartManyProcesses from "../use_case/StartManyProcesses";
  import debug from "debug";
  import { capitalize, isNull, range, some } from "lodash";
  import PausePlease from "../PausePlease.svelte";
  import type { IMemory } from "../use_case/MemoryWriteSync";
  import { createMemorySyncStoreAndSync } from "../use_case/MemoryWriteSync";
  import BaseMemoryView from "./BaseMemoryView.svelte";
  import ContendingOrNot from "../port/ContendingOrNot";
  const d = debug(`BaseDemo`);

  export let process_count: number = null;
  export let algorithm_impl_url: URL = null;
  export let prefix: string = null;
  export let memory: IMemory = null;
  if (some([process_count, algorithm_impl_url, prefix, memory], isNull)) {
    throw new Error("invalid arguments");
  }

  const [stores, m] = createMemorySyncStoreAndSync(memory);
  d("created stores %o", get(stores));

  const con = new ContendingOrNot(prefix, process_count);
  const [overview, contending, in_region] =
    con.get_stores_overview_contending_acquired();

  const dd = new StartManyProcesses(
    process_count,
    algorithm_impl_url,
    con.core_message_handler,
    m,
    con.debug_message_handler
  );

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
  <slot {stores} {memory}>
    <BaseMemoryView {stores} {memory} />
  </slot>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
