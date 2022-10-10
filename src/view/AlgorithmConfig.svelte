<script lang="ts">
  import { router } from "./model";
  import { range } from "lodash-es";

  export let process_count: number;
  export let max_process_count: number;
  export let enable_breakpoint: boolean;

  const maxCount = max_process_count;
  process_count = Math.min(max_process_count, process_count);
  $: step = Math.floor(maxCount / 5);
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <div class="btn" on:click={() => router.pop()}>back</div>
  </div>
  <div class="navbar-end relative h-12 gap-2">
    <div
      class="btn btn-success absolute right-0 h-10"
      on:click={() => router.push("InSimulation")}
    >
      go
    </div>
  </div>
</div>

<div class="flex place-content-between items-center ">
  <span class="text-2xl underline">Process count</span>
  <div class="my-6 text-4xl">{process_count}</div>
</div>
<input
  type="range"
  min="1"
  max={maxCount}
  bind:value={process_count}
  class="range range-primary range-lg"
  step="1"
/>
<div class="relative mx-2 flex h-8 w-full justify-between px-2">
  {#each range(1, Math.max(2, maxCount - 1), step) as stop, idx}
    <span
      class="absolute {stop > 9 && `-translate-x-1/2`} text-2xl"
      style="left:{(100 * idx * step) / maxCount}%;"
    >
      {stop}
    </span>
  {/each}
  <span class="absolute right-0 -translate-x-1/2 text-2xl">{maxCount}</span>
</div>
<div class="divider" />
<div class="form-control mt-12">
  <label class="label cursor-pointer">
    <span class="label-text text-2xl underline">Enable breakpoint</span>
    <input
      type="checkbox"
      class="toggle toggle-primary toggle-lg"
      bind:checked={enable_breakpoint}
    />
  </label>
</div>
