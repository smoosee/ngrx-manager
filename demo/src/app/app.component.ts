import { Component, OnInit, Signal, signal } from '@angular/core';
import { StoreFacade } from './app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-signals';

  stateValue = this.store.select('App');
  stateObservable = this.store.select('App', true);
  stateSignal = this.store.select('App', false);

  logs: any[] = [];

  constructor(private store: StoreFacade) { }

  ngOnInit(): void { }

  onClick(btn: string) {
    switch (btn) {
      case 'dispatch':
        this.store.dispatch('App', 'TEST_FN').subscribe((data) => {
          this.logs.unshift({ action: 'dispatch', type: 'subscribe', data });
        });
        break;
      case 'set':
        this.store.set('App', { set: true }).subscribe((data) => {
          this.logs.unshift({ action: 'set', type: 'subscribe', data });
        });
        break;
      case 'extend':
        this.store.extend('App', { extend: true }).subscribe((data) => {
          this.logs.unshift({ action: 'extend', type: 'subscribe', data });
        });
        break;
      case 'refresh':
        this.stateValue = this.store.select('App');
        this.logs.unshift({ action: 'refresh', type: 'sync', data: {} });
        break;
      case 'unset':
        this.store.unset('App').subscribe((data) => {
          this.logs.unshift({ action: 'unset', type: 'subscribe', data });
        });
        break;
    }
  }
}
