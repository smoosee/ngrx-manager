import { Component, OnInit } from '@angular/core';
import { StoreFacade } from './app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ngrx-manager';

  stateValue = this.store.select('App');
  stateObservable = this.store.select('App', true);
  stateSignal = this.store.select('App', false);

  logs: any[] = [];

  constructor(private store: StoreFacade) { }

  ngOnInit(): void { }

  onClick(btn: string) {
    switch (btn) {
      case 'dispatch':
        this.store.dispatch('App', 'APP_TEST_2').subscribe((data) => {
          this.logs.unshift({ action: 'dispatch', type: 'subscribe', data });
        });
        break;
      case 'set':
        this.store.set('App', { set: true }).subscribe((data) => {
          this.logs.unshift({ action: 'set', type: 'subscribe', data });
        });
        break;
      case 'extend':
        this.store.extend('App', { extend: true }).then((data) => {
          this.logs.unshift({ action: 'extend', type: 'then', data });
        });
        break;
      case 'refresh':
        this.stateValue = this.store.select('App');
        this.logs.unshift({ action: 'refresh', type: 'sync', data: {} });
        break;
      case 'unset':
        this.store.unset('App').then((data) => {
          this.logs.unshift({ action: 'unset', type: 'then', data });
        });
        break;
    }
  }
}
