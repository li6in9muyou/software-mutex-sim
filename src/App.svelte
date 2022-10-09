<script lang="ts">
  import InSimulation from "./view/InSimulation/InSimulation.svelte";
  import AlgorithmSelect from "./view/AlgorithmSelect.svelte";
  import { head } from "lodash";
  import AlgorithmConfig from "./view/AlgorithmConfig.svelte";
  import SlidingPages from "./view/SlidingPages.svelte";
  import SlidingPagesAdapter from "./view/adapter/SlidingPagesAdapter.js";
  import AlgorithmTable from "./algorithms/AlgorithmTable";
  import WebWorkerProcessGroup from "./use_case/WebWorkerProcessGroupAdapter";
  import { setContext } from "svelte";
  import { derived, writable } from "svelte/store";

  const availableAlgorithms = Array.from(AlgorithmTable.values());
  let selected = writable(head(availableAlgorithms));
  let process_count = 4;
  let enable_breakpoint = writable(false);
  setContext("enable_breakpoint", enable_breakpoint);
  setContext(
    "source_code",
    derived(selected, (s) => s.source_code)
  );
  setContext(
    "memory_transform",
    derived(selected, (s) => s.memory_transform)
  );
  const getProcessGroup = derived(
    selected,
    (s) => () =>
      new WebWorkerProcessGroup(
        process_count,
        $selected.algorithm_impl_url,
        $selected.get_memory
      )
  );
</script>

<div class="w-full overflow-x-hidden">
  <SlidingPages offset={$SlidingPagesAdapter}>
    <slot slot="left">
      <AlgorithmSelect
        options={availableAlgorithms}
        bind:selected={$selected}
      />
    </slot>
    <slot slot="middle">
      <AlgorithmConfig
        bind:process_count
        bind:enable_breakpoint={$enable_breakpoint}
        max_process_count={$selected?.max_process_count ?? 13}
      />
    </slot>
    <slot slot="right">
      <InSimulation getProcessGroup={$getProcessGroup} />
    </slot>
  </SlidingPages>
</div>
