<script>
  import { range } from "lodash";
  import { readable } from "svelte/store";
  import { sleep } from "../utility";

  let allPaused = true;
  function toggle() {
    allPaused = !allPaused;
  }
  const processRunningState = new Array(10).fill(true);

  let selectedPid = 0;
  let turn = 3;
  let _c = 4;
  const currentLineno = readable(_c, (set) => {
    const i = setInterval(() => {
      _c += 1;
      _c %= 7;
      set(_c);
    }, 500);
    return () => clearInterval(i);
  });

  let showPauseSpinner = false;

  function toggle_process_running(pid) {
    showPauseSpinner = true;
    sleep(500).then(() => {
      showPauseSpinner = false;
      processRunningState[pid] = !processRunningState[pid];
    });
  }
</script>

<div class="navbar mb-2 rounded bg-base-200 shadow-xl">
  <div class="navbar-start">
    <a class="btn">back</a>
  </div>
  <div class="navbar-end gap-2">
    <a class="btn btn-warning" class:btn-disabled={allPaused} on:click={toggle}>
      pause all
    </a>
    <a
      class="btn btn-success"
      class:btn-disabled={!allPaused}
      on:click={toggle}
    >
      resume all
    </a>
  </div>
</div>

<main class="mt-4 flex max-h-[90vh] flex-col">
  <section>
    <h2 class="mb-2 text-2xl underline">inspect one process</h2>
    <div class="flex max-h-64 flex-col gap-3 overflow-y-auto">
      {#each range(0, 10) as pid}
        <div
          class:bg-primary={pid === selectedPid}
          class="flex rounded border border-primary bg-base-100 p-4"
          on:click={() => (selectedPid = pid)}
        >
          <div>
            {`pid ${pid} status`}
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
    <h2 class="mb-2 text-2xl underline">source code</h2>
    <ol
      class="flex max-h-64 flex-col overflow-y-auto rounded bg-base-300 text-primary-content"
    >
      {#each range(0, 7) as lineno}
        {#if lineno === $currentLineno}
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
    <h2 class="mb-2 text-2xl underline">shard memory</h2>
    <div>
      <div class="mb-2 text-xl">level</div>
      <div class="mb-3 flex w-full gap-1">
        {#each range(-5, 5) as idx}
          <div
            class="flex flex-1 justify-center border border-secondary text-xl"
          >
            {(idx + 1) * (idx + 1)}
          </div>
        {/each}
      </div>
    </div>
    <div>
      <div class="mb-2 text-xl">turn</div>
      <div class="text-2xl">{turn}</div>
    </div>
  </section>
</main>
