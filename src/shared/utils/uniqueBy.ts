
export function uniqueBy<T extends { [k: string]: any }>(array: T[], iteratee: string | ((item: T) => string)): T[] {
  const seen = new Map();
  return array.filter((item, idx) => {
    const key: string = typeof iteratee === 'string' ? iteratee : iteratee(item);
    return seen.has(key) ? false : seen.set(key, idx) && true;
  });
}
