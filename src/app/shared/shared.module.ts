import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { AccountParametersComponent } from './components/account-parameters/account-parameters.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, AccountParametersComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [TranslateModule, WebviewDirective, FormsModule]
})
export class SharedModule { }
