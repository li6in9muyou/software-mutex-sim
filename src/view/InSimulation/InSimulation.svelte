<script lang="ts">
  import { every, range } from "lodash";
  import { derived, get } from "svelte/store";
  import { router } from "../model";
  import debug from "debug";
  import { onDestroy, onMount } from "svelte";
  import Memory from "./Memory.svelte";
  import ProcessAgent from "./ProcessAgent.svelte";
  import { ProcessState } from "../../use_case/RunningSync";
  import SourceCodeView from "./SourceCodeView/SourceCodeView.svelte";
  import ProcessGroup from "../../use_case/ProcessGroupFacade";
  import { CurrentSelectedAlgorithm } from "../algorithm_config";
  import SimulationBuilder from "../../use_case/SimulationBuilder";
  const note = debug("InSimulation::Main");

  const process_count: number = $CurrentSelectedAlgorithm.process_count;
  const ProcessHandle: ProcessGroup = ProcessGroup.GetMany(
    new SimulationBuilder($CurrentSelectedAlgorithm)
  );
  const memory_store = ProcessHandle.get_store("Memory");
  const processRunningState = ProcessHandle.get_store("LifeCycle");
  const is_in_region = ProcessHandle.get_store("WhoIsIn");
  const many_lineno = ProcessHandle.get_store("LineNumber");

  onMount(() => {
    note("begin!");
    note(
      "stores: %o",
      [processRunningState, is_in_region, many_lineno].map((s: any) => get(s))
    );
  });

  onDestroy(() => {
    note("finish!");
    ProcessHandle.killAll();
  });

  $: CurrentProcessLineno = derived(many_lineno, (arr) => arr[selectedPid]);

  let allPaused = true;
  function onToggleAllRunOrPause() {
    if (allPaused) {
      ProcessHandle.resumeAll();
    } else {
      ProcessHandle.pauseAll();
    }
    allPaused = !allPaused;
  }

  let started = false;
  function onStartSim() {
    started = true;
    allPaused = false;
    ProcessHandle.runAll();
  }

  const allCompleted = derived(processRunningState, (arr) =>
    every(arr, (s) => s === ProcessState.completed)
  );
  let selectedPid = 0;
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
        <ProcessAgent
          {pid}
          bind:selectedPid
          in_region={$is_in_region[pid]}
          procState={$processRunningState[pid]}
          ProcessHandle={ProcessHandle.get_pid(pid)}
        />
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
  <section class="flex flex-grow flex-col gap-2">
    <slot>
      <Memory stores={memory_store} />
    </slot>
  </section>
</main>
