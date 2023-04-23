import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateConfig, StoreOptions } from '@smoosee/ng-signals';

@Injectable()
export class AppState extends StateConfig<any> {
    override name = 'AppState';
    override initial = {};
    override options: StoreOptions = {
        storage: 'session'
    }

    constructor(private http: HttpClient) {
        super();
    }

    mapReduce(data: any) {
        return data;
    }

    @Action('TEST_FN')
    testFn(data: any) {
        console.log('###', 'testFn', data);
    }

    @Action('TEST_FN2')
    testFn2() {
        this.http.get('assets/config.json');
    }
}