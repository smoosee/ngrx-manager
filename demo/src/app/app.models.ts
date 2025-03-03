
export interface AppState {
  set: boolean;
  extend: boolean;
  nestedValue: {
    name: string;
    age: number;
    address: {
      address: string;
      city: string;
    }
    arr: (string | number)[]
  }
}

export interface SharedState {
  useThis: boolean;
  useThat: boolean;
}

export type LogObject = { name: string, age: number };
export type DispatchObject = {
  "filename": string;
  "payload": {
    "function": string;
    "state": string;
    "language": string;
    "source": string;
  }
}