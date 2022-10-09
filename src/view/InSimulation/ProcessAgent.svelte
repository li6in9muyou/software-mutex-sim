<script lang="ts">
  import type IProcess from "../../use_case/IProcess";
  import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
  import { isFunction, isNull, some } from "lodash-es";
  import { LockingState } from "../../use_case/IProgram";
  import { get, type Readable } from "svelte/store";
  import { getContext } from "svelte";
  import SpinnerAndText from "./SpinnerAndText.svelte";

  export let selectedPid: number = null;
  export let ProcessHandle: IProcess = null;
  if (some([selectedPid, ProcessHandle], isNull)) {
    throw new Error("invalid arguments");
  }
  const enableBreakpoint =
    getContext<Readable<boolean>>("enable_breakpoint") ?? false;
  const pid = ProcessHandle.pid;
  let procState, in_region;
  $: ProcessHandle.execution_state.subscribe((v) => (procState = v));
  $: ProcessHandle.program.locking_state.subscribe(
    (v) => (in_region = v === LockingState.Locked)
  );

  let showPauseSpinner = false;
  let unsub;
  function showPauseSpinnerUntilChange() {
    showPauseSpinner = true;
    const prev = get(ProcessHandle.execution_state);
    unsub = ProcessHandle.execution_state.subscribe((v) => {
      if (v !== prev) {
        showPauseSpinner = false;
      }
      if (isFunction(unsub)) {
        unsub();
      }
    });
  }
  function handleStart() {
    if (!$enableBreakpoint) {
      showPauseSpinnerUntilChange();
    }
    ProcessHandle.start();
  }
  function handleToggle() {
    if (!$enableBreakpoint) {
      showPauseSpinnerUntilChange();
    }
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
  $: description = `${procStateDisplay.get(procState)} ${
    in_region ? "🔒" : "✖"
  }`;
  let buttonFuncLabel;
  $: if ($enableBreakpoint) {
    buttonFuncLabel = "step";
  } else {
    buttonFuncLabel =
      procState === ProcessLifeCycle.running ? "pause" : "resume";
  }
</script>

<div
  class:bg-secondary={isSelected}
  class:text-accent-content={isSelected}
  class:bg-base-100={!isSelected}
  class:text-base-content={!isSelected}
  class="flex h-fit w-fit flex-col items-start gap-3 rounded border border-accent p-2 pt-0 text-xl transition-colors duration-300"
  on:click={() => (selectedPid = pid)}
>
  <div>
    {`#${pid}`}
    <div class="whitespace-nowrap">
      {description}
    </div>
  </div>
  {#if isSelected}
    {#if isIdle}
      <button class="btn btn-success btn-sm ml-auto" on:click={handleStart}>
        <span class="flex items-center">
          <SpinnerAndText show={showPauseSpinner} text="start" />
        </span>
      </button>
    {:else}
      <button
        class:btn-disabled={!isSelected ||
          (isSelected && in_region && $enableBreakpoint)}
        class:btn-warning={procState === ProcessLifeCycle.running &&
          !$enableBreakpoint}
        class:btn-success={procState === ProcessLifeCycle.paused}
        class="btn btn-sm ml-auto"
        on:click={handleToggle}
      >
        <span class="flex items-center">
          <SpinnerAndText show={showPauseSpinner} text={buttonFuncLabel} />
        </span>
      </button>
    {/if}
  {/if}
</div>
