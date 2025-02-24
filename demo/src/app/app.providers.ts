import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppStore } from './app.store';



export const APP_PROVIDERS = [
    importProvidersFrom(BrowserModule),
    AppStore.forRoot(),
    provideHttpClient(withInterceptorsFromDi()),
]