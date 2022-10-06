<script lang="ts">
  import { ProcessState } from "../../use_case/RunningSync";
  import Process from "../../use_case/ProcessFacade";

  export let pid: number = null;
  export let selectedPid: number = null;
  export let in_region: ProcessState = null;
  export let procState: ProcessState = null;
  export let ProcessHandle: Process = null;

  let showPauseSpinner = false;
  function handleToggle() {
    switch (procState) {
      case ProcessState.paused: {
        ProcessHandle.resume();
        break;
      }
      case ProcessState.running: {
        ProcessHandle.pause();
        break;
      }
    }
  }

  const procStateDisplay = new Map([
    [ProcessState.ready, "▶"],
    [ProcessState.completed, "✅"],
    [ProcessState.running, "🏃"],
    [ProcessState.paused, "⏸"],
  ]);

  $: isSelected = pid === selectedPid;
  $: isIdle =
    procState === ProcessState.ready || procState === ProcessState.completed;
  $: description =
    `${procStateDisplay.get(procState)} #${pid} ` +
    `${in_region ? "🔒✔" : "✖"}`;
</script>

<div
  class:bg-secondary={isSelected}
  class:text-accent-content={isSelected}
  class:bg-base-100={!isSelected}
  class:text-base-content={!isSelected}
  class="inline-flex w-fit items-center gap-3 rounded border border-accent p-1 text-xl transition-colors duration-300"
  on:click={() => (selectedPid = pid)}
>
  <div>
    {description}
  </div>
  {#if isSelected}
    {#if isIdle}
      <button
        class="btn btn-success btn-sm ml-auto"
        on:click={() => ProcessHandle.start()}
      >
        {#if showPauseSpinner}
          <svg
            class="-ml-1 mr-3 h-5 w-5 animate-spin text-error"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        {/if}
        start
      </button>
    {:else}
      <button
        class:btn-disabled={!isSelected}
        class:btn-warning={procState === ProcessState.running}
        class:btn-success={procState === ProcessState.paused}
        class="btn btn-sm ml-auto"
        on:click={handleToggle}
      >
        {#if showPauseSpinner}
          <svg
            class="-ml-1 mr-3 h-5 w-5 animate-spin text-error"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        {/if}
        {procState === ProcessState.running ? "pause" : "resume"}
      </button>
    {/if}
  {/if}
</div>
