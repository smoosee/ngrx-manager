import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideStoreForRoot } from '@smoosee/ngrx-manager';
import { AppStoreOptions, AppStoreStates } from './app.store';



export const APP_PROVIDERS = [
    importProvidersFrom(BrowserModule),
    provideStoreForRoot(AppStoreOptions, AppStoreStates),
    provideHttpClient(withInterceptorsFromDi()),
]