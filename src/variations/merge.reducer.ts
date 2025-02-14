import { StoreAction } from "../models/store.action";
import { UpdateFlag } from "../models/store.options";
import { StoreReducer } from "../models/store.reducer";
import { StoreState } from "../models/store.state";
import { DefaultActions } from "../shared/store.enums";
import { mergeDeep } from "../shared/store.utils";


export class MergeReducer extends StoreReducer {

  override getPayload(state: StoreState, statePayload: any, action: StoreAction) {
    const { onSet, onDispatch } = state.options.flags!;
    const isExtendAction = action.name === DefaultActions.EXTEND;
    const isSetAction = action.name === DefaultActions.SET;
    
    const flag: UpdateFlag = action.flag || (isExtendAction ? 'extend' : isSetAction ? onSet : onDispatch) || 'override';

    const actionPayload = typeof action.payload === 'object' ? action.payload : { payload: action.payload };

    switch (flag) {
      case 'extend':
        return mergeDeep(statePayload, actionPayload!, true);
      case 'override':
        return { ...statePayload, ...actionPayload }
      case 'replace':
        return structuredClone(actionPayload);
    }
  }

}
