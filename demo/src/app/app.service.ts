import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DispatchObject, LogObject } from './app.models';

@Injectable({ providedIn: 'root' })
export class AppService {
  private http = inject(HttpClient);

  appLog(args: LogObject) {
    console.log('###', 'appLog', args);
    return args;
  }

  appDispatch(type?: 'app' | 'shared') {
    return this.http.get<DispatchObject>(`assets/${type}_dispatch.json`);
  }

  sharedDispatch() {
    return this.appDispatch('shared');
  }

}

