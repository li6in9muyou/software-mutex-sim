<script>
  import {
    process_status,
    those_in_critical_region,
    those_contending,
  } from "../../SveltePort";
  import { process_create, process_count } from "./Peterson";
  import { onMount } from "svelte";
  import { level_store, victim_store } from "./Peterson.js";

  console.info("Peterson's begins");
  onMount(async () => {
    for (let i = 0; i < process_count; i++) {
      await process_create(i);
    }
  });
</script>

<section>
  <h1>Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>{$level_store}</p>
  <p>{$victim_store}</p>
  <h2>overview</h2>
  <p>process_status:{$process_status}</p>
  <p>those in critical region:{$those_in_critical_region}</p>
  <p>those not in critical region:{$those_contending}</p>
</section>
