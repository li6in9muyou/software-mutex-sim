<script lang="ts">
  import { ProcessState } from "../../use_case/RunningSync";
  import type { Readable } from "svelte/store";
  import debug from "debug";
  import { get } from "svelte/store";
  const note = debug("ProcessAgent");

  export let pid: number;
  export let showPauseSpinner: boolean;
  export let selectedPid: number;
  export let in_region: Readable<ProcessState[]>;
  export let running: Readable<boolean[]>;
  export let toggle_process_running: (pid: number) => void;

  note(in_region, running, get(in_region), get(running));
</script>

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
      $in_region[pid] ? "in critical region" : "contending"
    }`}
  </div>
  <button
    class:btn-disabled={pid !== selectedPid}
    class:btn-warning={$running[pid]}
    class:btn-success={!$running[pid]}
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
    {$running[pid] ? "pause" : "resume"}
  </button>
</div>
