import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideStoreForRoot } from '@smoosee/ngrx-manager';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStoreOptions, AppStoreStates } from './app.store';
import { PartialModule } from './partial/partial.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    //
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    PartialModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideStoreForRoot(AppStoreOptions, AppStoreStates),
    provideHttpClient(withInterceptorsFromDi()),
    provideExperimentalZonelessChangeDetection(),
  ]
})
export class AppModule { }
