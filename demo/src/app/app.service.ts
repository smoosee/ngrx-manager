import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type LogObject = { name: string, age: number };

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) { }

  appLog(args: LogObject) {
    console.log('###', 'appLog', args);
  }

  appDispatch(type: 'app' | 'shared') {
    return this.http.get(`assets/${type}_dispatch.json`);
  }

  sharedDispatch() {
    return this.appDispatch('shared');
  }

}