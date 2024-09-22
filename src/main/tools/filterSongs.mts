import { parseFile } from "music-metadata";

/* 过滤后缀 */
export function filterWithSuffixes(paths: string[], suffixs: string[]) {
  return paths.filter((path) =>
    suffixs.some((suffix) => path.endsWith("." + suffix)),
  );
}

/* 异步过滤 */
async function asyncFilter<T>(
  arr: T[],
  predicate: (item: T) => Promise<boolean>,
) {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_, index) => results[index]);
}

/* 过滤歌手 */
export function filterWithArtists(paths: string[], artistsList: string[]) {
  return asyncFilter(paths, async (path) => {
    const metadata = await parseFile(path);
    return (
      metadata.common?.artists?.some((person) =>
        artistsList.includes(person),
      ) ?? false
    );
  });
}

/* 获取全部歌手 */
export async function getAllArtists(paths: string[]) {
  const artists = new Set<string>();
  for (const path of paths) {
    const metadata = await parseFile(path);
    if (metadata.common?.artists)
      metadata.common.artists.forEach((artist) => artists.add(artist));
  }
  return Array.from(artists);
}
