<script lang="ts">
  import { find, join, times } from "lodash";
  import { router } from "./model";
  import type IStaticAlgorithmDescription from "../algorithms/IStaticAlgorithmDescription";
  import { StaticDescription } from "./algorithm_config";
  import { get } from "svelte/store";

  export let options: IStaticAlgorithmDescription[] = [];

  let sName = get(StaticDescription)?.name;
  $: StaticDescription.set(find(options, (op) => op.name === sName));
  $: description =
    $StaticDescription?.description ??
    join(
      times(10, () => sName),
      ", "
    );
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <a class="btn btn-ghost text-4xl normal-case text-accent">MutexSim</a>
  </div>
  <div class="navbar-end">
    <a class="btn" on:click={() => router.push("AlgoConfig")}>next</a>
  </div>
</div>

<main class="p-4">
  <label class="label">
    <span class="label-text mb-4 text-2xl underline">Choose an algorithm</span>
  </label>
  <select
    class="select select-primary w-full max-w-xs text-xl"
    bind:value={sName}
  >
    {#each options as op, idx}
      <option value={op.name}>{op.name}</option>
    {/each}
  </select>

  <div class="divider" />
  <div class="text-xl">
    {description}
  </div>
</main>
