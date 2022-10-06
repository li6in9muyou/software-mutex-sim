<script>
  import { router } from "./model";
  import { CurrentSelectedAlgorithm, ProcessCount } from "./algorithm_config";
  import { range } from "lodash";

  $: maxCount = Math.min($CurrentSelectedAlgorithm?.max_process_count ?? 13);
  $: ProcessCount.set(Math.min(maxCount, $ProcessCount));
  $: step = Math.floor((maxCount - 1) / 4);
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <a class="btn" on:click={() => router.pop()}>back</a>
  </div>
  <div class="navbar-end gap-2">
    <a class="btn btn-success" on:click={() => router.push("InSimulation")}
      >go</a
    >
  </div>
</div>

<h1 class="text-2xl underline">How many processes to spawn?</h1>
<h2 class="mt-16 mb-8 text-6xl">{$ProcessCount}</h2>
<input
  type="range"
  min="1"
  max={maxCount}
  bind:value={$ProcessCount}
  class="range range-primary range-lg"
  step="1"
/>
<div class="flex w-full justify-between px-2">
  {#each range(1, maxCount, step) as stop}
    <span class="text-2xl">{stop}</span>
  {/each}
  <span class="text-2xl">{maxCount}</span>
</div>
