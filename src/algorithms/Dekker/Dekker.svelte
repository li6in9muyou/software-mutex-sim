<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { RunAndSync } from "../../use_case/RunAndSync";
  import {
    build_init_context,
    build_worker,
    sync_memory_to_store,
  } from "./Dekker";

  const wants_to_enter_store = writable([]);
  const turn_store = writable([]);

  const demo = new RunAndSync(
    2,
    { wants_to_enter: wants_to_enter_store, turn: turn_store },
    build_worker,
    () => build_init_context(),
    (ctx) => sync_memory_to_store(wants_to_enter_store, turn_store, ctx)
  );

  const port = demo.port;
  const those_in_critical_region = port.those_in_critical_region;
  const those_contending = port.those_contending;
  const process_status = port.process_status;

  onMount(async () => {
    console.info("Dekker's begins");
    await demo.start();
  });
</script>

<section>
  <h1>Dekker's/Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>wants_to_enter:{$wants_to_enter_store}</p>
  <p>turn:{$turn_store}</p>
  <h2>overview</h2>
  <p>process_status:{$process_status}</p>
  <p>those in critical region:{$those_in_critical_region}</p>
  <p>those not in critical region:{$those_contending}</p>
</section>
