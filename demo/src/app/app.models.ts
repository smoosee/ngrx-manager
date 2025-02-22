
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