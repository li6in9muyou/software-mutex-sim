<script lang="ts">
  import { ProcessLifeCycle } from "../../use_case/IProcessLifeCycle";
  import { LockingState } from "../../use_case/IProgram";
  import FaLock from "svelte-icons/fa/FaLock.svelte";
  import FaLockOpen from "svelte-icons/fa/FaLockOpen.svelte";
  import FaPlay from "svelte-icons/fa/FaPlay.svelte";
  import FaRegCheckSquare from "svelte-icons/fa/FaRegCheckSquare.svelte";
  import FaRunning from "svelte-icons/fa/FaRunning.svelte";
  import FaPause from "svelte-icons/fa/FaPause.svelte";

  export let pid: number;
  export let procState: ProcessLifeCycle;
  export let locked: LockingState;

  const iconClass = "h-6 w-6 ";
</script>

<div>
  {`#${pid}`}
  <div class="flex gap-2">
    {#if procState === ProcessLifeCycle.ready}
      <div class={iconClass + "text-primary"}>
        <FaPlay />
      </div>
    {:else if procState === ProcessLifeCycle.completed}
      <div class={iconClass + "text-base-content"}>
        <FaRegCheckSquare />
      </div>
    {:else if procState === ProcessLifeCycle.running}
      <div class={iconClass + "text-secondary"}>
        <FaRunning />
      </div>
    {:else}
      <div class={iconClass + "text-secondary-content"}>
        <FaPause />
      </div>
    {/if}
    {#if locked}
      <div class={iconClass + "text-[red]"}>
        <FaLock />
      </div>
    {:else}
      <div class={iconClass}>
        <FaLockOpen />
      </div>
    {/if}
  </div>
</div>
