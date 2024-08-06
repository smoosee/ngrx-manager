import { StoreAction } from "../models/store.action";
import { StoreFlags } from "../models/store.options";
import { StoreReducer } from "../models/store.reducer";
import { StoreState } from "../models/store.state";
import { DefaultActions } from "../shared/store.enums";
import { mergeDeep } from "../shared/store.utils";


export class MergeReducer extends StoreReducer {
  
  override getPayload(state: StoreState, payload: any, action: StoreAction) {
    const { extendOnSet, extendOnDispatch, mergeArrays } = { ...state?.options?.flags, ...action.flags } as StoreFlags;
    const isExtendAction = action.name === DefaultActions.EXTEND;
    const isSetAction = action.name === DefaultActions.SET;
    const isDispatchAction = !isExtendAction && !isSetAction;
    const shouldExtend = isExtendAction || (extendOnSet && isSetAction) || (extendOnDispatch && isDispatchAction);
    const merged = mergeDeep(payload, action.payload, mergeArrays);
    const cloned = structuredClone(action.payload);
    return shouldExtend ? merged : cloned;
  }

}
