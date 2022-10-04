<script lang="ts">
  import { range } from "lodash";
  import { get, type Readable, type Writable } from "svelte/store";
  import { router } from "../model";
  import { type MemorySliceStores } from "../../use_case/MemoryWriteSync";
  import debug from "debug";
  import { onMount } from "svelte";
  import Memory from "./Memory.svelte";
  import ProcessAgent from "./ProcessAgent.svelte";
  import { type ProcessState } from "../../use_case/RunningSync";
  import type IProcessHandle from "../../use_case/ProcessHandle";
  import make_handle from "../adapter/SingleProcessHandleAdapter";
  const note = debug("InSimulation::Main");

  export let memory_store: MemorySliceStores = null;
  export let per_process_state: {
    process_count: number;
    running: Writable<ProcessState[]>;
    in_critical_region_or_not: Readable<boolean[]>;
    lineno: Readable<number[]>;
  } = null;
  export let ProcessHandle: IProcessHandle;

  const {
    running: processRunningState,
    in_critical_region_or_not: is_in_region,
    lineno: many_lineno,
    process_count,
  } = per_process_state;

  onMount(() => {
    note("begin!");
    note(
      "stores: %o",
      [processRunningState, is_in_region, many_lineno].map((s: any) => get(s))
    );
  });

  let allPaused = true;
  function onToggleAllRunOrPause() {
    allPaused = !allPaused;
  }

  let started = false;
  function onStartSim() {
    started = true;
    allPaused = false;
    ProcessHandle.runAll();
  }

  let selectedPid = 0;
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <a class="btn" on:click={() => router.pop()}>back</a>
  </div>
  <div class="navbar-end gap-2">
    {#if started}
      <a
        class="btn btn-warning"
        class:btn-disabled={allPaused}
        on:click={onToggleAllRunOrPause}
      >
        pause all
      </a>
      <a
        class="btn btn-success"
        class:btn-disabled={!allPaused}
        on:click={onToggleAllRunOrPause}
      >
        resume all
      </a>{:else}
      <button class="btn btn-success" on:click={onStartSim}> start </button>
    {/if}
  </div>
</div>

<main class="mt-4 flex max-h-[90vh] flex-col">
  <section>
    <h2 class="mb-2 text-2xl underline">inspect one process</h2>
    <div class="flex max-h-64 flex-col gap-3 overflow-y-auto">
      {#each range(0, process_count) as pid}
        <ProcessAgent
          {pid}
          bind:selectedPid
          in_region={$is_in_region[pid]}
          procState={$processRunningState[pid]}
          ProcessHandle={make_handle(pid, ProcessHandle)}
        />
      {/each}
    </div>
  </section>
  <div class="divider my-0" />
  <section>
    <h2 class="mb-2 text-2xl underline">
      source code of process {selectedPid}
    </h2>
    <ol
      class="flex max-h-64 flex-col overflow-y-auto rounded bg-base-300 text-primary-content"
    >
      {#each range(0, 7) as lineno}
        {#if lineno === $many_lineno[selectedPid]}
          <li class="indicator ml-4">
            <span
              class="badge indicator-item badge-secondary badge-sm indicator-start indicator-middle"
            />
            <div class="px-4">
              {`${lineno} one two three four five`}
            </div>
          </li>
        {:else}
          <div class="ml-4 px-3 transition-all duration-300">
            {`${lineno} one two three four five`}
          </div>
        {/if}
      {/each}
    </ol>
  </section>
  <div class="divider my-0" />
  <section class="flex flex-grow flex-col gap-2">
    <slot>
      <Memory stores={memory_store} />
    </slot>
  </section>
</main>
