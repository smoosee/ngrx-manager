import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) {}

  testFn(...args: any) {
    console.log('###', 'testFn', args);
  }

  testFn2() {
    return this.http.get('assets/config.json');
  }
}
