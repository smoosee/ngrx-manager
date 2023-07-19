<div align="center">

<h1> @smoosee/ngrx-manager </h1>
<p>Plug-N-Play State Manager for NGRX stores</p>

[![][img.release]][link.release]
[![][img.license]][link.license]

![][img.node]
![][img.npm]
![][img.downloads]

[![][img.banner]][link.npm]

</div>

## Features

- ⚡️ Simple plug-n-play.
- 🅰️ Supports latest Angular v16.
- 😎 Action Based Processing.
- 💪 Strongly Typed States.
- 📦 Save into Local & Session Storage.
- 📃 Comprehensive APIs.
- 🔁 Backward Compatibility with RxJs Observables.

<h2>Table of Contents</h2>

- [Install](#install)
- [Usage](#usage)
  - [Exported Configuration Types](#exported-configuration-types)
    - [StoreOptions](#storeoptions)
    - [StoreState](#StoreState)
    - [StoreAction](#StoreAction)
    - [StateReducer](#statereducer)
  - [Setup The Store](#setup-the-store)
    - [forRoot](#forroot)
    - [forChild](#forchild)
  - [Dispatching Actions](#dispatching-actions)
  - [Listening To State Changes](#listening-to-state-changes)
  - [Strongly Typed States](#strongly-typed-states)

## Install

```shell
yarn add @smoosee/ngrx-manager

# OR

npm install @smoosee/ngrx-manager
```

## Usage

### Exported Configuration Types

#### StoreOptions

| key       | type     | default  | constraint | description                                                                                                                              |
| --------- | -------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `app`     | `string` | `null`   | Optional   | a name that is used to group states.                                                                                                     |
| `prefix`  | `string` | `null`   | Optional   | a prefix that is used to group apps.                                                                                                     |
| `storage` | `string` | `"none"` | Optional   | optional value of `session`, `local` or `none` that determines if we will use `sessionStorage` or `localStorage` to hold the store data. |

#### StoreState

| key          | type             | default | constraint | description                                                 |
| ------------ | ---------------- | ------- | ---------- | ----------------------------------------------------------- |
| `name`       | `string`         | `null`  | Required   | a name that identifies the state.                           |
| `initial`    | `object`         | `{}`    | Optional   | initial value of the state.                                 |
| `actions`    | `StoreAction[]`  | `[]`    | Optional   | list of actions that will be executed against the state.    |
| `options`    | `StoreOptions`   | `{}`    | Optional   | override global `StoreOptions`.                             |
| `reducers`   | `StateReducer[]` | `[]`    | Optional   | list of reducers that will be used to map the state data.   |

#### StoreAction

| key       | type     | default | constraint | description                                               |
| --------- | -------- | ------- | ---------- | --------------------------------------------------------- |
| `name`    | `string` | `null`  | Required   | a name that identifies the action.                        |
| `service` | `any`    | `null`  | Required   | the service class that will be injected for this action.  |
| `method`  | `string` | `null`  | Required   | the method name that will be called inside the `service`. |

#### StateReducer

| key         | type                                                                           | default | constraint | description                                                     |
| ----------- | ------------------------------------------------------------------------------ | ------- | ---------- | --------------------------------------------------------------- |
| `mapReduce` | (`state`: `StoreState`, `value`: `any`, `action?`: `ExtendedAction`) => `any` | `null`  | Required   | the reducer function that will be called to map the state data. |

### Setup The Store

You can setup the store using multiple methods available thru different exported items depending on your needs.

#### forRoot

- This method is used to setup the Store globally.
- This is helpful if you have a single entry application.
- In case if you have module-federation setup, jump to `forChild`.

```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { StoreModule } from "@smoosee/ngrx-manager";

import { AppComponent } from "./app.component";

import { StoreOptions, StatesConfigs } from "./app.store";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StoreModule.forRoot(StoreOptions, StatesConfigs)],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### forChild

- This method is used to setup feature States.
- This is typically helpful if you have module-federation or modules with different states that you need to setup separately.

```typescript
// app.module.ts
import { NgModule } from "@angular/core";
import { StoreModule } from "@smoosee/ngrx-manager";

import { PageComponent } from "./page.component";

import { StoreOptions, StatesConfigs } from "./page.store";

@NgModule({
  declarations: [PageComponent],
  imports: [StoreModule.forChild(StatesConfigs, StoreOptions)],
})
export class PageModule {}
```


### Dispatching Actions

To communicate with the Store, you have to use the `StoreFacade` service.

```typescript
    // inject the `StoreFacade` service by using it in the constructor
    constructor(private storeFacade: StoreFacade) {}
    // OR
    storeFacade = inject(StoreFacade);


    // dispatch action to the store
    // will trigger the `increment` action
    // for the `Test` state
    this.storeFacade.dispatch("Test", "increment");

    // dispatch action to the store
    // will trigger the `SET` action
    // for the `App` state
    this.storeFacade.set("App", { name: "smoosee" });

    // dispatch action to the store
    // will trigger the `EXTEND` action
    // for the `App` state
    // which is basically extending the current state
    // with the new data instead of replacing it like the `SET` action
    this.storeFacade.extend("App", { name: "smoosee" });

    // dispatch action to the store
    // will trigger the `UNSET` action
    // for the `App` state
    this.storeFacade.unset("App");

    // clear all data from the store
    // this will trigger the `UNSET` action
    // for all states
    this.storeFacade.clear();
```

### Listening To State Changes

To listen to state changes, you have to use the `StoreFacade` service.

```typescript
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { StoreFacade } from "@smoosee/ngrx-manager";

@Component({
  selector: "app-root",
  template: `
    <div>value: {{ stateValue | json }}</div>
    <div>observable: {{ sateObservable | async | json }}</div>
    <div>signal: {{ stateSignal() | json }}</div>
  `,
})
export class AppComponent implements OnInit {
  // retrieve value of the state synchronously
  stateValue = this.facade.select("App");
  // retrieve value of the state asynchronously as Observable
  stateObservable = this.facade.select("App", true);
  // retrieve value of the state asynchronously as Signal
  stateSignal = this.facade.select("App", false);

  constructor(private facade: StoreFacade) {}

  ngOnInit() {}
}
```

### Strongly Typed States

To achieve Strongly Typed States, you would need to do the following

```typescript
// STEP 1
// create interfaces or classes of the states models.

interface AppState {
    set: boolean;
    extend: boolean;
}

interface SharedState {
    useThis: boolean;
    useThat: boolean;
}

// STEP 2
// generate the store state configs using the StoreState, StoreAction classes.
// Also use the state interfaces created in STEP 1 with the `initial` property

export const AppStoreStates = [
    new StoreState({
        name: 'App',
        initial: <AppState>{},
        actions: [
            new StoreAction({
                name: 'APP_TEST_1',
                service: AppService,
                method: 'testFn',
            }),
            new StoreAction({
                service: AppService,
                name: 'APP_TEST_2',
                method: 'testFn2',
            })
        ]
    }),
    new StoreState({
        name: 'Shared',
        initial: <SharedState>{},
        actions: [
            new StoreAction({
                name: 'Shared_TEST_1',
                service: AppService,
                method: 'testFn2',
            })
        ]
    })
];

// STEP 3
// use `StoreFacade<typeof AppStoreStates>`.
@Injectable({ provided: "root" })
export class AppFacade extends StoreFacade<typeof AppStoreStates> {
  constructor() {
    super();
  }
}
```

You will then be able to use state names and action names when dispatching or selecting from the store.

## License

MIT License

Copyright (c) 2023 Mostafa Sherif

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[img.release]: https://img.shields.io/github/actions/workflow/status/smoosee/ngrx-manager/release.yml?logo=github&label=release
[img.license]: https://img.shields.io/github/license/smoosee/ngrx-manager?logo=github
[img.node]: https://img.shields.io/node/v/@smoosee/ngrx-manager?logo=node.js&logoColor=white&labelColor=339933&color=grey&label=
[img.npm]: https://img.shields.io/npm/v/@smoosee/ngrx-manager?logo=npm&logoColor=white&labelColor=CB3837&color=grey&label=
[img.downloads]: https://img.shields.io/npm/dt/@smoosee/ngrx-manager?logo=docusign&logoColor=white&labelColor=purple&color=grey&label=
[img.banner]: https://nodei.co/npm/@smoosee/ngrx-manager.png
[link.release]: https://github.com/smoosee/ngrx-manager/actions/workflows/release.yml
[link.license]: https://github.com/smoosee/ngrx-manager/blob/master/LICENSE
[link.npm]: https://npmjs.org/package/@smoosee/ngrx-manager
