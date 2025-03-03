type Input = { [k: string]: any };
type Output<O extends Input, N extends Input> = O & N;

export function mergeDeep<O extends Input, N extends Input>(oPayload: O, nPayload: N, extendArrays = false): Output<O, N> {
  const oClone = structuredClone(oPayload);
  if (Array.isArray(nPayload)) {
    return extendArrays ? [].concat(...(oClone as any || []), ...nPayload) as any : [].concat(...nPayload);
  } else if (typeof nPayload === 'object') {
    return Object.entries(nPayload ?? {}).reduce((acc, [key, nValue]) => {
      acc[key] = mergeDeep(acc?.[key], nValue, extendArrays);
      return acc;
    }, (oClone || {}) as any);
  } else {
    return nPayload;
  }

}