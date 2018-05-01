import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../shared/shared.module';

import {FornecedorRoutingModule} from './fornecedor-routing.module';
import {FornecedorComponent} from './fornecedor.component';
import {FornecedorDataComponent} from './fornecedor-data/fornecedor-data.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FornecedorRoutingModule
  ],
  declarations: [FornecedorComponent, FornecedorDataComponent]
})
export class FornecedorModule { }
