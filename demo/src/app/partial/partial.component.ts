import { Component, OnInit } from '@angular/core';
import { AppStore } from '../app.store';

@Component({
  selector: 'app-partial',
  template: ``,
  standalone: true
})
export class PartialComponent implements OnInit {
  store = AppStore.inject();

  ngOnInit() {
    this.store.set('App', { test: 123 } as any);
  }
}