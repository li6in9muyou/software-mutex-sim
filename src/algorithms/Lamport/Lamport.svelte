<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { RunAndSync } from "../../use_case/RunAndSync";
  import {
    build_init_context,
    build_worker,
    sync_memory_to_store,
  } from "./Lamport";

  const process_count = 10;
  const flag_store = writable([]);
  const label_store = writable([]);

  const demo = new RunAndSync(
    process_count,
    { flag: flag_store, label: label_store },
    build_worker,
    () => build_init_context(process_count),
    (ctx) => sync_memory_to_store(flag_store, label_store, ctx)
  );

  const port = demo.port;
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.process_status;

  onMount(async () => {
    console.info("Lamport's begins");
    await demo.start();
  });
</script>

<section>
  <h1>Lamport's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>flag: {$flag_store}</p>
  <p>label: {$label_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
