import { map, timer } from "rxjs";
import { ActionKeys, ActionStatus, DefaultActions } from "../signals.const";
import { Injector, WritableSignal, signal } from "@angular/core";

export interface StateAction {
    name: string;
    service: any;
    method: string;
    state?: string;
}

export class ExtendedAction<T = any> {
    name: DefaultActions | string;
    service: any;
    method: string;
    state?: string;


    payload: any;
    status = signal(ActionStatus.NONE);


    [ActionKeys.success]?: boolean;
    [ActionKeys.timestamp]?: number;
    [ActionKeys.triggered]?: boolean;
    [ActionKeys.unset]?: boolean;
    [ActionKeys.error]?: boolean;

    get type() {
        return `[${this.state}] ${this.name}_DATA_${this.status()}`;
    }

    constructor(state: string, action: any) {
        this.name = action.name;
        this.service = action.service;
        this.method = action.method;

        this.state = state;

        this.status.update(() => action?.status || ActionStatus.NONE);
        this.payload = action?.payload;
    }

    dispatch(payload: any, status = ActionStatus.NEW) {
        this.payload = payload;
        this.status.update(() => status);
        if (status === ActionStatus.NEW) {
            this[ActionKeys.timestamp] = Date.now();
        }
    }


    execute(injector: Injector) {
        this.status.update(() => ActionStatus.TRIGGERED);
        try {
            let observable;
            if (this.service && this.method) {
                const service = injector.get<any>(this.service);
                const method = service?.[this.method];
                observable = method.call(service, this.payload);
            } else {
                observable = timer(0).pipe(map(() => this.payload));
            }
            observable.subscribe((payload: any) => this.sideEffect(payload, true));
        } catch (error) {
            this.sideEffect(error, false);
        }
    }

    sideEffect(payload?: any, success = false) {
        const status = success ? ActionStatus.SUCCESS : ActionStatus.ERROR;
        return this.dispatch(payload, status);
    }

}
