import { ActionKeys, ActionStatus } from "./signals.const";

export interface StateAction {
    name: string;
    service: any;
    method: string;
    state?: string;
}

export class ExtendedAction implements StateAction {
    name: string;
    service: any;
    method: string;
    state: string;


    status: ActionStatus;

    payload: any;

    [ActionKeys.success]?: boolean;
    [ActionKeys.timestamp]?: number;
    [ActionKeys.triggered]?: boolean;
    [ActionKeys.unset]?: boolean;
    [ActionKeys.error]?: boolean;

    get type() {
        return `[${this.state}] ${this.name}_DATA_${this.status}`;
    }

    constructor(state: string, action: any) {
        this.name = action.name;
        this.service = action.service;
        this.method = action.method;

        this.state = state;

        this.status = (action as ExtendedAction)?.status || ActionStatus.NEW;
        this.payload = (action as ExtendedAction)?.payload;
    }

    dispatch(payload?: any, status = ActionStatus.NEW) {
        this.payload = payload;
        this.status = status;
        if (status === ActionStatus.NEW) {
            this[ActionKeys.timestamp] = Date.now();
        }
        return this;
    }
}
