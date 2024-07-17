import { NgModule } from '@angular/core';

import { PartialComponent } from './partial.component';

@NgModule({
    exports: [PartialComponent],
    declarations: [PartialComponent],
    providers: [],
})
export class PartialModule { }
