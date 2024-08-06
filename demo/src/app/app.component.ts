import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StoreFacade } from './app.facade';
import { PartialComponent } from './partial/partial.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [JsonPipe, AsyncPipe, PartialComponent]
})
export class AppComponent implements OnInit {
  title = 'ngrx-manager';
  store = inject(StoreFacade);

  stateValue = this.store.select('App');
  stateObservable = this.store.select('App', true);
  stateSignal = this.store.select('App', false);

  logs: any[] = [];


  ngOnInit(): void { }

  onClick(btn: string) {
    switch (btn) {
      case 'http':
        this.store.dispatch('App', 'SHARED_DISPATCH' as any).subscribe((data) => {
          this.logs.unshift({ action: 'dispatch', type: 'subscribe', data });
        });
        break;
      case 'log':
        this.store.dispatch('App', 'APP_LOG', 'test log').subscribe((data) => {
          this.logs.unshift({ action: 'log', type: 'subscribe', data });
        });
        break;
      case 'set':
        this.store.set('App', { set: true, nestedValue: { arr: [123] } }).subscribe((data) => {
          this.logs.unshift({ action: 'set', type: 'subscribe', data });
        });
        break;
      case 'extend':
        this.store.extend('App', { nestedValue: { arr: [456] } }, { mergeArrays: true }).subscribe((data) => {
          this.logs.unshift({ action: 'extend', type: 'then', data });
        });
        break;
      case 'refresh':
        this.stateValue = this.store.select('App');
        this.logs.unshift({ action: 'refresh', type: 'sync', data: {} });
        break;
      case 'unset':
        this.store.unset('App').subscribe((data) => {
          this.logs.unshift({ action: 'unset', type: 'then', data });
        });
        break;
    }
  }
}
