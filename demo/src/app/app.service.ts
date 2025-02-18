import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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

@Injectable({ providedIn: 'root' })
export class AppService {
  http = inject(HttpClient);

  appLog(args: LogObject) {
    console.log('###', 'appLog', args);
    return args;
  }

  appDispatch(type: 'app' | 'shared') {
    return this.http.get<DispatchObject>(`assets/${type}_dispatch.json`);
  }

  sharedDispatch() {
    return this.appDispatch('shared');
  }

}

