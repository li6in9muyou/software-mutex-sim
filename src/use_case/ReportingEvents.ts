export const Pre = () => ({ type: "pre" });
export const Post = () => ({ type: "post" });
export const LineNumber = (lineno: number) => ({
  type: "lineno",
  payload: lineno,
});
