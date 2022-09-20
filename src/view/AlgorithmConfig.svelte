<script>
  import { router } from "./model";
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
<h1 class="font-4xl">config works</h1>
