import { Component, OnInit } from '@angular/core';
import { StoreFacade } from '../app.facade';

@Component({
  selector: 'app-partial',
  template: ``,
})
export class PartialComponent implements OnInit {
  constructor(private store: StoreFacade) { }

  ngOnInit() {
    this.store.set('App', { test: 123 } as any);
  }
}
