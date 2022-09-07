<script>
  import { onMount } from "svelte";
  import { process_count } from "./Peterson";

  console.info("Peterson's begins");
  onMount(() => {
    for (let i = 0; i < process_count; i++) {
      const t = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
      t.onmessage = (ev) => console.info(`${i} said: ` + ev.data);
      t.postMessage(i);
    }
    console.log("done spawning");
  });
</script>

<section>
  <h1>Peterson's Algorithm</h1>
  <h2>Global Memory</h2>
  <p>level:</p>
  <p>victim:</p>
  <h2>overview</h2>
  <p>process_status:</p>
  <p>those in critical region:</p>
  <p>those not in critical region:</p>
</section>
