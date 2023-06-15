import { Injectable } from '@angular/core';
import { StoreFacade as StateFacade } from '@smoosee/ngrx-manager';
import { AppStoreStates } from './app.store';


@Injectable({ providedIn: 'root' })
export class StoreFacade extends StateFacade<typeof AppStoreStates> {
    constructor() {
        super();
    }

}