export const Pre = () => ({ type: "pre" });
export const Post = () => ({ type: "post" });
export const LineNumber = (lineno: number) => ({
  type: "lineno",
  payload: lineno,
});
export const Ready = () => ({ type: "ready" });
export const Running = () => ({ type: "running" });
export const Paused = () => ({ type: "paused" });
export const Completed = () => ({ type: "completed" });
