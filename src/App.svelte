<script>
  import {
    process_status,
    those_in_critical_region,
    those_contending,
  } from "./SveltePort";
  import {
    wants_to_enter_store,
    turn_store,
  } from "./algorithms/Dekker/DekkerPort";
  import { process_zero, process_one } from "./algorithms/Dekker/Dekker";
  import { onMount } from "svelte";

  console.info("Dekker's begins");
  onMount(async () => {
    while (true) {
      await process_one();
      await process_zero();
    }
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
