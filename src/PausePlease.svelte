<script lang="ts">
  export let prefix;
  export let pid;
  export let pause;
  export let resume;

  function toggle() {
    if (!shouldPause) {
      pause(pid);
    } else {
      resume(pid);
    }
  }
  let shouldPause = false;
</script>

<label for={prefix + pid}>
  <input
    type="checkbox"
    name=""
    id={prefix + pid}
    on:change={toggle}
    bind:checked={shouldPause}
  />
  {pid}
</label>
