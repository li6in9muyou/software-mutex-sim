<script lang="ts">
  import { router } from "./model";
  import { range } from "lodash";

  export let process_count: number;
  export let max_process_count: number;
  export let enable_breakpoint: boolean;

  const maxCount = max_process_count;
  process_count = Math.min(max_process_count, process_count);
  $: step = Math.floor((maxCount - 1) / 4);
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <div class="btn" on:click={() => router.pop()}>back</div>
  </div>
  <div class="navbar-end gap-2">
    <div class="btn btn-success" on:click={() => router.push("InSimulation")}>
      go
    </div>
  </div>
</div>

<h1 class="text-2xl underline">How many processes to spawn?</h1>
<h2 class="mt-16 mb-8 text-6xl">{process_count}</h2>
<input
  type="range"
  min="1"
  max={maxCount}
  bind:value={process_count}
  class="range range-primary range-lg"
  step="1"
/>
<div class="flex w-full justify-between px-2">
  {#each range(1, maxCount, step) as stop}
    <span class="text-2xl">{stop}</span>
  {/each}
  <span class="text-2xl">{maxCount}</span>
</div>
