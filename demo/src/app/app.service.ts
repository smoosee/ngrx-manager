import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) { }

  appLog(...args: any) {
    console.log('###', 'appLog', args);
  }

  appDispatch() {
    return this.http.get('assets/app_dispatch.json');
  }

  sharedDispatch() {
    return this.http.get('assets/shared_dispatch.json');
  }
}
