<script>
  import { join, times } from "lodash";
  let selected = "Pick one";
  $: description = join(
    times(10, () => selected),
    ", "
  );
</script>

<div class="navbar bg-base-200 mb-2 shadow-xl rounded">
  <div class="navbar-start">
    <a class="btn btn-ghost normal-case text-xl">MutexSim</a>
  </div>
  <div class="navbar-end"><a class="btn">next</a></div>
</div>

<main class="p-4">
  <label class="label">
    <span class="label-text text-2xl underline mb-4">Choose an algorithm</span>
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
