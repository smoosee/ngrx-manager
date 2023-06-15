import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignalsModule } from '@smoosee/ngrx-manager';
import { HttpClientModule } from '@angular/common/http';
import { PartialModule } from './partial/partial.module';
import { AppStoreOptions, AppStoreStates } from './app.store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // SignalsModule.forRoot(AppStoreOptions, AppStoreStates),
    // SignalsModule.forChild({}, AppStoreStates),
    PartialModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
