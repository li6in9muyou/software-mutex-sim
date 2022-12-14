<script lang="ts">
  import { every, times } from "lodash-es";
  import { derived, get, type Readable } from "svelte/store";
  import { router } from "../model";
  import debug from "debug";
  import { getContext, onDestroy, onMount } from "svelte";
  import Memory from "./Memory.svelte";
  import ProcessAgent from "./ProcessAgent.svelte";
  import SourceCodeView from "./SourceCodeView.svelte";
  import type IProcessGroup from "../../use_case/IProcessGroup";
  import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
  const note = debug("InSimulation.svelte");

  export let getProcessGroup: () => IProcessGroup;
  let manyProcess = getProcessGroup();
  const enable_breakpoint = getContext<Readable<boolean>>("enable_breakpoint");

  const process_count: number = manyProcess.process_count;
  let allCompleted, processes;
  $: {
    processes = times(process_count, (pid) => manyProcess.pid(pid));
    allCompleted = derived(manyProcess.all.execution_state, (arr) =>
      every(arr, (s) => s === ProcessLifeCycle.completed)
    );
  }

  onMount(() => {
    note("begin!");
    const enable = get(enable_breakpoint);
    setTimeout(() => {
      if (enable === true || enable === false) {
        manyProcess.all.set_breakpoint(enable);
      } else {
        note(`enable_breakpoint=${enable}`);
      }
    }, 500);
  });

  onDestroy(() => {
    note("finish!");
    manyProcess.all.kill();
  });

  let selectedPid = 0;
  $: CurrentProcessLineno = manyProcess.all.program[selectedPid].line_number;

  let allPaused = true;
  function onToggleAllRunOrPause() {
    if (allPaused) {
      manyProcess.all.resume();
    } else {
      manyProcess.all.pause();
    }
    allPaused = !allPaused;
  }

  let started = false;
  function onStartSim() {
    started = true;
    allPaused = false;
    manyProcess.all.start();
  }

  function onResetSim() {
    started = false;
    allPaused = false;
    manyProcess.all.kill();
    manyProcess = getProcessGroup();
  }

  function onAllStep() {
    manyProcess.all.resume();
  }
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <div class="btn" on:click={() => router.pop()}>back</div>
  </div>
  <div class="navbar-end relative h-12 gap-2">
    {#if started && !$allCompleted}
      {#if started && $enable_breakpoint}
        <div class="btn btn-success absolute right-0" on:click={onAllStep}>
          step all
        </div>
      {:else}
        <div
          class="btn btn-warning absolute right-0"
          class:btn-disabled={allPaused}
          on:click={onToggleAllRunOrPause}
        >
          pause all
        </div>
        <div
          class="btn btn-success absolute right-0"
          class:btn-disabled={!allPaused}
          on:click={onToggleAllRunOrPause}
        >
          resume all
        </div>
      {/if}
    {:else if $allCompleted}
      <button class="btn btn-warning absolute right-0" on:click={onResetSim}>
        reset
      </button>
    {:else}
      <button class="btn btn-success absolute right-0" on:click={onStartSim}>
        start
      </button>
    {/if}
  </div>
</div>

<main class="mt-4 flex max-h-[90vh] flex-col">
  <section>
    <h2 class="mb-2 text-2xl underline">inspect one process</h2>
    <div class="flex max-h-64 gap-3 overflow-y-auto">
      {#each processes as process}
        <ProcessAgent bind:selectedPid ProcessHandle={process} />
      {/each}
    </div>
  </section>
  <div class="divider my-0" />
  <section>
    <h2 class="mb-2 text-2xl underline">
      source code of process {selectedPid}
    </h2>
    <SourceCodeView lineno={CurrentProcessLineno} />
  </section>
  <div class="divider my-0" />
  <slot>
    <Memory stores={manyProcess.memory} />
  </slot>
</main>
