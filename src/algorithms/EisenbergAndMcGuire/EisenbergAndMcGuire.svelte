<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { RunAndSync } from "../../use_case/RunAndSync";
  import {
    build_init_context,
    build_worker,
    sync_memory_to_store,
  } from "./EisenbergAndMcGuire";

  const process_count = 13;
  const flag_store = writable([]);
  const turn_store = writable(0);

  const demo = new RunAndSync(
    process_count,
    { flag: flag_store, turn: turn_store },
    build_worker,
    () => build_init_context(process_count),
    (ctx) => sync_memory_to_store(flag_store, turn_store, ctx)
  );

  const port = demo.port;
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.process_status;

  onMount(async () => {
    console.info("EisenbergAndMcGuire's begins");
    await demo.start();
  });
</script>

<section>
  <h1>Eisenberg/McGuire's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>flag: {$flag_store}</p>
  <p>turn: {$turn_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
