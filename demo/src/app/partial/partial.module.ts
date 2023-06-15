import { NgModule } from '@angular/core';

import { PartialComponent } from './partial.component';
import { SignalsModule } from '@smoosee/ngrx-manager';

@NgModule({
    imports: [SignalsModule],
    exports: [PartialComponent],
    declarations: [PartialComponent],
    providers: [],
})
export class PartialModule { }
