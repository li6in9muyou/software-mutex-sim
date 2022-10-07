<script lang="ts">
  import { every, range } from "lodash";
  import { derived } from "svelte/store";
  import { router } from "../model";
  import debug from "debug";
  import { onDestroy, onMount } from "svelte";
  import Memory from "./Memory.svelte";
  import ProcessAgent from "./ProcessAgent.svelte";
  import SourceCodeView from "./SourceCodeView/SourceCodeView.svelte";
  import type IProcessGroup from "../../use_case/IProcessGroup";
  import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
  import { LockingState } from "../../use_case/IProgram";
  const note = debug("InSimulation.svelte");

  export let processGroup: IProcessGroup;

  const process_count: number = processGroup.process_count;
  let manyProcess = processGroup;
  let memory_store = manyProcess.memory;
  let processRunningState = derived(
    manyProcess.all.execution_state,
    (arr, set) => set(arr)
  );
  let is_in_region = derived(
    manyProcess.all.program.map((prog) => prog.locking_state),
    (lock, set) => {
      set(lock.map((state) => state === LockingState.Locked));
    }
  );
  let allCompleted = derived(processRunningState, (arr) =>
    every(arr, (s) => s === ProcessLifeCycle.completed)
  );

  onMount(() => {
    note("begin!");
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
  }
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <div class="btn" on:click={() => router.pop()}>back</div>
  </div>
  <div class="navbar-end gap-2">
    {#if started && !$allCompleted}
      <div
        class="btn btn-warning"
        class:btn-disabled={allPaused}
        on:click={onToggleAllRunOrPause}
      >
        pause all
      </div>
      <div
        class="btn btn-success"
        class:btn-disabled={!allPaused}
        on:click={onToggleAllRunOrPause}
      >
        resume all
      </div>
    {:else if $allCompleted}
      <button class="btn btn-warning" on:click={onResetSim}> reset </button>
    {:else}
      <button class="btn btn-success" on:click={onStartSim}> start </button>
    {/if}
  </div>
</div>

<main class="mt-4 flex max-h-[90vh] flex-col">
  <section>
    <h2 class="mb-2 text-2xl underline">inspect one process</h2>
    <div class="flex max-h-64 flex-wrap gap-3 overflow-y-auto">
      {#each range(0, process_count) as pid}
        <ProcessAgent bind:selectedPid ProcessHandle={manyProcess.pid(pid)} />
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
    <Memory stores={memory_store} />
  </slot>
</main>
