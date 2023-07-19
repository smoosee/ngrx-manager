import { ActionKeys, ActionStatus, DefaultActions } from "../shared";


export class StoreAction<T = any, K extends string = string> {
    state?: string;

    name: K | keyof typeof DefaultActions | undefined;
    service?: new (...args: any[]) => T;
    method?: keyof T;

    payload?: any;
    status: ActionStatus = undefined as any;

    [ActionKeys.success]?: boolean;
    [ActionKeys.timestamp]?: number;
    [ActionKeys.pending]?: boolean;
    [ActionKeys.unset]?: boolean;
    [ActionKeys.error]?: boolean;
    [ActionKeys.uuid]?: string;


    get type() {
        return `[${this.state}] ${this.name}_DATA_${this.status}`;
    }

    constructor(action: K | Partial<StoreAction<T, K>>, state?: string) {
        this.state = state;
        this[ActionKeys.uuid] = Math.random().toString(36).substr(2, 9);

        if (typeof (action) === 'string') {
            this.name = action;
        } else if (action) {
            this.name = action.name || 'SET';
            this.service = action.service;
            this.method = action.method;
            this.payload = action.payload;
            this.status = action.status || ActionStatus.NONE;
            this[ActionKeys.timestamp] = action[ActionKeys.timestamp];
            this[ActionKeys.uuid] = action[ActionKeys.uuid] || this[ActionKeys.uuid];
        }

    }

    dispatch(payload: any, newStatus = ActionStatus.NEW) {
        this.payload = payload;
        this.status = newStatus;
        if (newStatus === ActionStatus.NEW) {
            this[ActionKeys.timestamp] = Date.now();
        }
        return this;
    }
}