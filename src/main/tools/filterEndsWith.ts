/* 过滤后缀 */
export default function (paths: string[], suffixs: string[]) {
  return paths.filter((path) =>
    suffixs.some((suffix) => path.endsWith("." + suffix)),
  );
}
