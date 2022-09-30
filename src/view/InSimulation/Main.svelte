<script lang="ts">
  import { range } from "lodash";
  import { get, type Readable } from "svelte/store";
  import { sleep } from "../../utility";
  import { router } from "../model";
  import { type MemorySliceStores } from "../../use_case/MemoryWriteSync";
  import debug from "debug";
  import { onMount } from "svelte";
  import Memory from "./Memory.svelte";
  const note = debug("InSimulation::Main");

  export let use_case = null;
  export let memory_store: MemorySliceStores = null;
  export let per_process_state: {
    process_count: number;
    running: Readable<boolean[]>;
    in_critical_region_or_not: Readable<boolean[]>;
    lineno: Readable<number[]>;
  } = null;

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

  let showPauseSpinner = false;
  function toggle_process_running(pid) {
    showPauseSpinner = true;
    sleep(500).then(() => {
      showPauseSpinner = false;
      processRunningState[pid] = !processRunningState[pid];
    });
  }

  let allPaused = true;
  function onToggleAllRunOrPause() {
    allPaused = !allPaused;
  }

  let started = false;
  function onStartSim() {
    started = true;
    allPaused = false;
    use_case.run();
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
        <div
          class:bg-secondary={pid === selectedPid}
          class:text-accent-content={pid === selectedPid}
          class:bg-base-100={pid !== selectedPid}
          class:text-base-content={pid !== selectedPid}
          class="flex rounded border border-accent p-4 transition-colors duration-300"
          on:click={() => (selectedPid = pid)}
        >
          <div>
            {`pid ${pid} status ${
              $is_in_region[pid] ? "in critical region" : "contending"
            }`}
          </div>
          <button
            class:btn-disabled={pid !== selectedPid}
            class:btn-warning={processRunningState[pid]}
            class:btn-success={!processRunningState[pid]}
            class="btn btn-sm ml-auto"
            on:click={() => toggle_process_running(pid)}
          >
            {#if showPauseSpinner && pid === selectedPid}
              <svg
                class="-ml-1 mr-3 h-5 w-5 animate-spin text-error"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-darkreader-inline-fill=""
                style="--darkreader-inline-fill:none;"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  data-darkreader-inline-stroke=""
                  style="--darkreader-inline-stroke:currentColor;"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  data-darkreader-inline-fill=""
                  style="--darkreader-inline-fill:currentColor;"
                />
              </svg>
            {/if}
            {processRunningState[pid] ? "pause" : "resume"}
          </button>
        </div>
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
