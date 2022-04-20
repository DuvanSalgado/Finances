import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { SkeletonModule } from '@app/shared/skeleton/skeleton.module';
import { CalculateService } from '@credit/service/calculate.service';
import { ExpensesService } from '@credit/service/expenses.service';
import { IonicModule } from '@ionic/angular';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses.routing';
import { ModalAddExpensesComponent } from './modal-add-expenses/modal-add-expenses.component';

@NgModule({
  declarations: [
    ExpensesComponent,
    ModalAddExpensesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ExpensesRoutingModule,
    SharedModule,
    SkeletonModule
  ],
  providers: [
    ExpensesService,
    CalculateService
  ]
})
export class ExpensesModule { }
