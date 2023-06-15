import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@smoosee/ngrx-manager';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStoreOptions, AppStoreStates } from './app.store';
import { PartialModule } from './partial/partial.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(AppStoreOptions),
    StoreModule.forChild(AppStoreStates),
    PartialModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
