<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { RunAndSync } from "../../use_case/RunAndSync";
  import {
    build_init_context,
    build_worker,
    sync_memory_to_store,
  } from "./Peterson";

  const process_count = 10;
  const level_store = writable([]);
  const victim_store = writable([]);

  const demo = new RunAndSync(
    process_count,
    { level: level_store, victim: victim_store },
    build_worker,
    () => build_init_context(process_count),
    (ctx) => sync_memory_to_store(level_store, victim_store, ctx)
  );

  const port = demo.port;
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.process_status;

  onMount(async () => {
    console.info("Peterson's begins");
    await demo.start();
  });
</script>

<section>
  <h1>Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>level: {$level_store}</p>
  <p>victim: {$victim_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
