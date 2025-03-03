import { Injectable, inject } from "@angular/core";
import { ReducerManager, Store } from "@ngrx/store";
import { UpdateFlag } from "../models/store.options";
import { StoreState } from "../models/store.state";
import { StoreDispatcher } from "../services/store.dispatcher";

@Injectable({ providedIn: 'root' })
export class NgrxStoreDispatcher extends StoreDispatcher {
  store = inject(Store);
  reducerManager = inject(ReducerManager);

  override add(state: StoreState) {
    super.add(state);
    this.reducerManager.addReducer(state.name, (data = state.initial, action) => {
      if (state.update) {
        return state.update(data, action);
      }
      return data;
    });
  }

  override dispatch(stateKey: string, actionKey: string, payload?: any, flag?: UpdateFlag) {
    const action = super.dispatch(stateKey, actionKey, payload, flag);
    this.store.dispatch(action);
    return action;
  }
}
