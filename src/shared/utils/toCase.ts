
export type CaseType = 'title' | 'camel' | 'pascal' | 'snake' | 'kebab';

export type SplitByUppercase<S extends string> = S extends `${infer First}${infer Rest}` ? First extends Lowercase<First> ? `${First}${SplitByUppercase<Rest>}` : ` ${Lowercase<First>}${SplitByUppercase<Rest>}` : S;
export type ReplaceSeparators<T extends string, S extends string> = T extends `${infer First}${S}${infer Rest}` ? `${First} ${ReplaceSeparators<Rest, S>}` : T;
export type TrimSpaces<S extends string> = S extends ` ${infer Rest}` ? TrimSpaces<Rest> : S extends `${infer Rest} ` ? TrimSpaces<Rest> : S extends `${infer First}  ${infer Rest}` ? TrimSpaces<`${First} ${Rest}`> : S;
export type NoramlizeString<S extends string> = Lowercase<TrimSpaces<ReplaceSeparators<SplitByUppercase<S>, '-' | '_'>>>;
export type StringToCase<S extends string, C extends CaseType> = NoramlizeString<S> extends `${infer F}${infer FR} ${infer S}${infer SR}` ?
  C extends 'title' ? `${Capitalize<F>}${FR} ${Capitalize<S>}${StringToCase<SR, C>}` :
  C extends 'pascal' ? `${Capitalize<F>}${FR}${Capitalize<S>}${StringToCase<SR, C>}` :
  C extends 'camel' ? `${F}${FR}${Capitalize<S>}${StringToCase<SR, C>}` :
  C extends 'kebab' ? `${F}${FR}-${S}${StringToCase<SR, C>}` :
  C extends 'snake' ? `${F}${FR}_${S}${StringToCase<SR, C>}` :
  never : NoramlizeString<S>;



export function toCase<S extends string, T extends CaseType>(str: S, type: T): StringToCase<S, T> {
  const normalizedStr = str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .toLowerCase();

  let returnValue: any;

  switch (type) {
    case 'title':
      returnValue = normalizedStr.replace(/(^|\s)\w/g, c => c.toUpperCase());
      break;
    case 'camel':
      returnValue = normalizedStr.replace(/ (\w)/g, (_, c) => c.toUpperCase());
      break;
    case 'pascal':
      returnValue = normalizedStr.replace(/ (\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/g, c => c.toUpperCase());
      break;
    case 'snake':
      returnValue = normalizedStr.replace(/ /g, '_');
      break;
    case 'kebab':
      returnValue = normalizedStr.replace(/ /g, '-');
      break;
    default:
      returnValue = str;
  }

  return returnValue;
}