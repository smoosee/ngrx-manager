<div align="center">

<h1> @smoosee/ng-signals </h1>
<p>Plug-N-Play State Manager for Angular Signals</p>

[![][img.release]][link.release]
[![][img.license]][link.license]

![][img.node]
![][img.npm]
![][img.downloads]

[![][img.banner]][link.npm]

</div>

<h2>Table of Contents</h2>

- [Install](#install)
- [Usage](#usage)
  - [Exported Configuration Types](#exported-configuration-types)
    - [StoreOptions](#storeoptions)
    - [StateConfig](#stateconfig)
    - [StateAction](#stateaction)
    - [StateReducer](#statereducer)
  - [Setup The Store](#setup-the-store)
    - [forRoot](#forroot)
    - [forChild](#forchild)
    - [initialize](#initialize)
  - [Creating States Dynamically](#creating-states-dynamically)
  - [Dispatching Actions](#dispatching-actions)
  - [Listening To State Changes](#listening-to-state-changes)

## Install

```shell
yarn add @smoosee/ng-signals

# OR

npm install @smoosee/ng-signals
```

## Usage

### Exported Configuration Types

#### StoreOptions

| key       | type     | default  | constraint | description                                                                                                                              |
| --------- | -------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `app`     | `string` | `null`   | Optional   | a name that is used to group states.                                                                                                     |
| `prefix`  | `string` | `null`   | Optional   | a prefix that is used to group apps.                                                                                                     |
| `storage` | `string` | `"none"` | Optional   | optional value of `session`, `local` or `none` that determines if we will use `sessionStorage` or `localStorage` to hold the store data. |

#### StateConfig

| key          | type             | default | constraint | description                                                 |
| ------------ | ---------------- | ------- | ---------- | ----------------------------------------------------------- |
| `name`       | `string`         | `null`  | Required   | a name that identifies the state.                           |
| `initial`    | `object`         | `{}`    | Optional   | initial value of the state.                                 |
| `actions`    | `StateAction[]`  | `[]`    | Optional   | list of actions that will be executed against the state.    |
| `options`    | `StoreOptions`   | `{}`    | Optional   | override global `StoreOptions`.                             |
| `reducers`   | `StateReducer[]` | `[]`    | Optional   | list of reducers that will be used to map the state data.   |
| `signal`     | `Signal`         | `null`  | Readonly   | a signal that will be used to listen to state changes.      |
| `observable` | `Observable`     | `null`  | Readonly   | an observable that will be used to listen to state changes. |

#### StateAction

| key       | type     | default | constraint | description                                               |
| --------- | -------- | ------- | ---------- | --------------------------------------------------------- |
| `name`    | `string` | `null`  | Required   | a name that identifies the action.                        |
| `service` | `any`    | `null`  | Required   | the service class that will be injected for this action.  |
| `method`  | `string` | `null`  | Required   | the method name that will be called inside the `service`. |

#### StateReducer

| key         | type                                                                           | default | constraint | description                                                     |
| ----------- | ------------------------------------------------------------------------------ | ------- | ---------- | --------------------------------------------------------------- |
| `mapReduce` | (`state`: `StateConfig`, `value`: `any`, `action?`: `ExtendedAction`) => `any` | `null`  | Required   | the reducer function that will be called to map the state data. |

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
import { SignalsModule } from "@smoosee/ng-signals";

import { AppComponent } from "./app.component";

import { StoreOptions, StatesConfigs } from "./app.store";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SignalsModule.forRoot(StoreOptions, StatesConfigs)],
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
import { SignalsModule } from "@smoosee/ng-signals";

import { PageComponent } from "./page.component";

import { StoreOptions, StatesConfigs } from "./page.store";

@NgModule({
  declarations: [PageComponent],
  imports: [SignalsModule.forChild(StoreOptions, StatesConfigs)],
})
export class PageModule {}
```

#### initialize

- This method resides inside the `SignalsManager` service.
- You can use this to setup the Store manually if you like to skip using the `SignalsModule`.
- This is typically helpful if you have a standalone component application.

```typescript
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { SignalsManager } from "@smoosee/ng-signals";

import { StoreOptions, StatesConfigs } from "./app.store";

@Component({
  selector: "app-root",
  template: ` <h1>App</h1> `,
  standalone: true,
  providers: [SignalsManager],
})
export class AppComponent implements OnInit {
  constructor(private signalsManager: SignalsManager) {
    this.signalsManager.initialize(StatesConfigs, StoreOptions);
  }

  ngOnInit() {}
}
```

### Adding States Dynamically

```typescript
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { SignalsManager } from "@smoosee/ng-signals";

import { StoreOptions, StatesConfigs } from "./app.store";

@Component({
  selector: "app-root",
  template: ` <h1>App</h1> `,
  standalone: true,
  providers: [SignalsManager],
})
export class AppComponent implements OnInit {
  constructor(private signalsManager: SignalsManager) {
    // This will add `App` state to the store.
    manager.addState("App");

    // This will add an action to the last added State.
    // in this case, it will be `App` state.
    manager.addAction({
      name: "increment",
      service: TestService,
      method: "increment",
    });

    // You can also chain the commands.
    // This will add `Test` state to the store.
    // And add the action to the same state.
    manager
      .addState({
        name: "Test",
        initial: { count: 0 },
        options: { storage: "none" },
      })
      .addAction({
        name: "increment",
        service: TestService,
        method: "increment",
      });

    // You can also add the action to a specific state.
    manager.addAction({
      name: "decrement",
      service: TestService,
      method: "decrement",
      state: "App",
    });
  }

  ngOnInit() {}
}
```

### Dispatching Actions

To communicate with the Store, you have to use the `SignalsFacade` service.

```typescript
    // inject the `SignalsFacade` service by using it in the constructor
    constructor(private signalsFacade: SignalsFacade) {}
    // OR
    signalsFacade = inject(SignalsFacade);


    // dispatch action to the store
    // will trigger the `increment` action
    // for the `Test` state
    this.signalsFacade.dispatch("Test", "increment");

    // dispatch action to the store
    // will trigger the `SET` action
    // for the `App` state
    this.signalsFacade.set("App", { name: "smoosee" });

    // dispatch action to the store
    // will trigger the `EXTEND` action
    // for the `App` state
    // which is basically extending the current state
    // with the new data instead of replacing it like the `SET` action
    this.signalsFacade.extend("App", { name: "smoosee" });

    // dispatch action to the store
    // will trigger the `UNSET` action
    // for the `App` state
    this.signalsFacade.unset("App");

    // clear all data from the store
    // this will trigger the `UNSET` action
    // for all states
    this.signalsFacade.clear();
```

### Listening To State Changes

To listen to state changes, you have to use the `SignalsFacade` service.

```typescript
// app.component.ts
import { Component, OnInit } from "@angular/core";
import { SignalsFacade } from "@smoosee/ng-signals";

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
  stateValue = this.facade.select<StoreData>("App");
  // retrieve value of the state asynchronously as Observable
  stateObservable = this.facade.select<StoreData>("App", true);
  // retrieve value of the state asynchronously as Signal
  stateSignal = this.facade.select<StoreData>("App", false);

  constructor(private facade: SignalsFacade) {}

  ngOnInit() {}
}
```



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


[img.release]: https://img.shields.io/github/actions/workflow/status/smoosee/vite-plugin-angular/release.yml?logo=github&label=release
[img.license]: https://img.shields.io/github/license/smoosee/vite-plugin-angular?logo=github
[img.node]: https://img.shields.io/node/v/@smoosee/vite-plugin-angular?logo=node.js&logoColor=white&labelColor=339933&color=grey&label=
[img.npm]: https://img.shields.io/npm/v/@smoosee/vite-plugin-angular?logo=npm&logoColor=white&labelColor=CB3837&color=grey&label=
[img.downloads]: https://img.shields.io/npm/dt/@smoosee/vite-plugin-angular?logo=docusign&logoColor=white&labelColor=purple&color=grey&label=
[img.banner]: https://nodei.co/npm/@smoosee/vite-plugin-angular.png
[link.release]: https://github.com/smoosee/vite-plugin-angular/actions/workflows/release.yml
[link.license]: https://github.com/smoosee/vite-plugin-angular/blob/master/LICENSE
[link.npm]: https://npmjs.org/package/@smoosee/vite-plugin-angular
