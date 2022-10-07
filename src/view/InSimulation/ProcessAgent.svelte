<script lang="ts">
  import type IProcess from "../../use_case/IProcess";
  import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
  import { isNull, some } from "lodash";
  import { LockingState } from "../../use_case/IProgram";

  export let selectedPid: number = null;
  export let ProcessHandle: IProcess = null;
  if (some([selectedPid, ProcessHandle], isNull)) {
    throw new Error("invalid arguments");
  }
  const pid = ProcessHandle.pid;
  let procState, in_region;
  ProcessHandle.execution_state.subscribe((v) => (procState = v));
  ProcessHandle.program.locking_state.subscribe(
    (v) => (in_region = v === LockingState.Locked)
  );

  let showPauseSpinner = false;
  function handleToggle() {
    switch (procState) {
      case ProcessLifeCycle.paused: {
        ProcessHandle.resume();
        break;
      }
      case ProcessLifeCycle.running: {
        ProcessHandle.pause();
        break;
      }
    }
  }

  const procStateDisplay = new Map([
    [ProcessLifeCycle.ready, "▶"],
    [ProcessLifeCycle.completed, "✅"],
    [ProcessLifeCycle.running, "🏃"],
    [ProcessLifeCycle.paused, "⏸"],
  ]);

  $: isSelected = pid === selectedPid;
  $: isIdle =
    procState === ProcessLifeCycle.ready ||
    procState === ProcessLifeCycle.completed;
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
        class:btn-warning={procState === ProcessLifeCycle.running}
        class:btn-success={procState === ProcessLifeCycle.paused}
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
        {procState === ProcessLifeCycle.running ? "pause" : "resume"}
      </button>
    {/if}
  {/if}
</div>
