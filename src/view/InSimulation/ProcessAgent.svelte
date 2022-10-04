<script lang="ts">
  import { ProcessState } from "../../use_case/RunningSync";
  import type IProcessHandle from "../../use_case/ProcessHandle";

  export let pid: number;
  export let selectedPid: number;
  export let in_region: ProcessState;
  export let procState: ProcessState;
  export let ProcessHandle: IProcessHandle;

  let showPauseSpinner = false;
  function handleToggle() {
    switch (procState) {
      case ProcessState.paused: {
        ProcessHandle.resume(pid);
        break;
      }
      case ProcessState.running: {
        ProcessHandle.pause(pid);
        break;
      }
    }
  }

  const procStateDisplay = new Map([
    [ProcessState.completed, "DONE"],
    [ProcessState.running, "RUNNING"],
    [ProcessState.paused, "PAUSED"],
  ]);
</script>

<div
  class:bg-secondary={pid === selectedPid}
  class:text-accent-content={pid === selectedPid}
  class:bg-base-100={pid !== selectedPid}
  class:text-base-content={pid !== selectedPid}
  class="flex items-center rounded border border-accent p-4 transition-colors duration-300"
  on:click={() => (selectedPid = pid)}
>
  <div>
    {`${procStateDisplay.get(procState)} pid ${pid} ` +
      `is ${in_region ? "in" : "not in "} critical region`}
  </div>
  <button
    class:btn-disabled={pid !== selectedPid}
    class:btn-warning={procState === ProcessState.running}
    class:btn-success={procState === ProcessState.paused}
    class:btn-disable={procState === ProcessState.completed}
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
</div>
