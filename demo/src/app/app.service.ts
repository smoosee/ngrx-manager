import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private http: HttpClient) { }

  testFn(...args: any) {
    console.log('###', 'testFn', args);
    return of(null);
  }

  testFn2() {
    return this.http.get('assets/config.json');
  }
}