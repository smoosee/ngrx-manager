import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignalsModule } from '@smoosee/ng-signals';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { PartialModule } from './partial/partial.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SignalsModule.forRoot(
      {
        prefix: 'prefix',
        app: 'app',
        storage: 'session',
      },
      [
        {
          name: 'App',
          actions: [
            {
              name: 'TEST_FN',
              service: AppService,
              method: 'testFn2',
            },
          ],
        },
      ]
    ),
    PartialModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
