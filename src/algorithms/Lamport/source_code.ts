export default [
  [1, "flag[pid] = TRUE;"],
  [2, "label[pid] = max(label) + 1;"],
  [3, "do {} while (should_wait(pid, label, flag));"],
  [4, "<<critical region>>"],
  [5, "flag[who] = FALSE;"],
] as [number, string][];
