import { Component, OnInit } from '@angular/core';
import { SignalsFacade } from '@smoosee/ng-signals';

@Component({
  selector: 'app-partial',
  template: ``,
})
export class PartialComponent implements OnInit {
  constructor(private store: SignalsFacade) {}

  ngOnInit() {
    this.store.set('App', { test: 123 });
  }
}
