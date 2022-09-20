<script>
  import { join, times } from "lodash";
  import { router } from "./model";
  let selected = "Pick one";
  $: description = join(
    times(10, () => selected),
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
  <select class="select select-primary w-full max-w-xs" bind:value={selected}>
    <option disabled selected>Pick one</option>
    <option>Dekker's</option>
    <option>Peterson's</option>
    <option>Eisenberg/McGuire's</option>
    <option>Lamport's</option>
  </select>

  <div class="divider" />
  <div class="text-xl">
    {description}
  </div>
</main>
