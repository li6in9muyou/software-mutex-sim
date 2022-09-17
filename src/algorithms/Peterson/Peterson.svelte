<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import StartManyProcesses from "../../use_case/StartManyProcesses";
  import debug from "debug";
  import { SveltePort } from "../../SveltePort";
  import { isUndefined, range } from "lodash";
  import PausePlease from "../../PausePlease.svelte";

  const process_count = 10;
  const stores = {
    level: writable([]),
    victim: writable([]),
  };
  const level_store = stores.level;
  const victim_store = stores.victim;
  const port = new SveltePort(process_count);
  const in_region = port.those_in_critical_region;
  const contending = port.those_contending;
  const overview = port.process_status;

  const d = debug("Algo:Peterson:Debug");
  const c = (msg) => {
    const [when, who] = msg;
    d("core msg %o", msg);
    if (when === "pre") {
      port.pre_critical_region(who);
    } else {
      port.post_critical_region(who);
    }
  };
  const m = (msg) => {
    const [which, array] = msg;
    if (!isUndefined(stores[which])) {
      d("update svelte store %s %o", which, array);
      stores[which].set(array);
    }
  };
  const memory = {
    level: new Int32Array(new SharedArrayBuffer(4 * process_count)),
    victim: new Int32Array(new SharedArrayBuffer(4 * process_count)),
  };
  const dd = new StartManyProcesses(
    process_count,
    new URL("./Peterson-tk2.ts", import.meta.url),
    c,
    m,
    d
  );
  const resume = dd.resume_by_pid.bind(dd);
  const pause = dd.pause_by_pid.bind(dd);
  onMount(async () => {
    console.info("Peterson's begins");
  });
</script>

<section>
  <h1>Peterson's Algorithm</h1>
  <button on:click={() => dd.run(memory, process_count)}>start</button>
  <h2>Pause</h2>
  <p>
    {#each range(0, process_count) as pid}
      <PausePlease {pid} prefix="peterson" {resume} {pause} />
    {/each}
  </p>
  <h2>Global Memory</h2>
  <p>level: {$level_store}</p>
  <p>victim: {$victim_store}</p>
  <h2>overview</h2>
  <p>process_status: {$overview}</p>
  <p>those in critical region: {$in_region}</p>
  <p>those not in critical region: {$contending}</p>
</section>
