import { NgModule } from '@angular/core';

import { PartialComponent } from './partial.component';
import { StoreModule } from '@smoosee/ngrx-manager';

@NgModule({
    imports: [StoreModule],
    exports: [PartialComponent],
    declarations: [PartialComponent],
    providers: [],
})
export class PartialModule { }
