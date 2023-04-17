import { Injectable, Signal } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { SignalsActions } from './actions.service';
import { ActionStatus } from '../models';
import { SignalsStore } from './store.service';

@Injectable({ providedIn: 'root' })
export class SignalsFacade {
  cache: any = {};
  returnType: 'signal' | 'observable' = 'signal';

  constructor(private store: SignalsStore, private actions: SignalsActions) { }

  select<T>(stateKey: string): T;
  select<T>(stateKey: string, async: false): Signal<T>;
  select<T>(stateKey: string, async: true): Observable<T>;
  select<T>(stateKey: string, async: boolean | null = null) {
    if (async === null) {
      return this.store.value(stateKey);
    } else if (async) {
      return this.store.observable(stateKey);
    } else {
      return this.store.signal<T>(stateKey);
    }
  }

  dispatch(stateKey: string, actionKey: string, payload?: any) {
    const action = this.actions.dispatch(stateKey, actionKey, payload);
    return this.store.observable(stateKey, action);
  }

  get<T>(stateKey: string): Observable<T> {
    return this.select(stateKey, true) as Observable<T>;
  }

  set<T>(stateKey: string, payload?: T) {
    return this.dispatch(stateKey, ActionStatus.SET, payload);
  }

  extend<T>(stateKey: string, payload?: T) {
    return this.dispatch(stateKey, ActionStatus.EXTEND, payload);
  }

  unset(stateKey: string) {
    return this.dispatch(stateKey, ActionStatus.UNSET);
  }

  init(
    stateKey: string,
    getter: Observable<any>,
    formatter = (data: any) => data,
    force = false
  ) {
    if (this.isEmpty(stateKey) || force) {
      return firstValueFrom(getter).then((data) => {
        this.set(stateKey, { ...formatter(data), cached: false });
      });
    } else {
      return firstValueFrom(this.set(stateKey, { cached: true }));
    }
  }

  clear(exclude: string[] = []) {
    Object.keys(this.store.states).forEach((stateKey) => {
      if (exclude.includes(stateKey)) {
        this.cache[stateKey] = this.select(stateKey);
      } else {
        this.unset(stateKey);
      }
    });
  }

  restore() {
    Object.keys(this.cache).forEach((stateKey) => {
      this.set(stateKey, this.cache[stateKey]);
      delete this.cache[stateKey];
    });
  }

  private isEmpty(stateKey: string) {
    return Object.keys(this.select(stateKey)).length > 0;
  }
}
