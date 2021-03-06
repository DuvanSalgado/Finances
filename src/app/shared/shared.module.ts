import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddButtonsComponent } from './add-buttons/add-buttons.component';
import { ButtonsActionsComponent } from './buttons-actions/buttons-actions.component';
import { ComboboxComponent } from './combobox/combobox.component';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
@NgModule({
  declarations: [
    SidebarComponent,
    ButtonsActionsComponent,
    ComboboxComponent,
    FooterComponent,
    AddButtonsComponent,
    CurrencyInputComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    SidebarComponent,
    ButtonsActionsComponent,
    ComboboxComponent,
    FooterComponent,
    AddButtonsComponent,
    CurrencyInputComponent
  ]
})
export class SharedModule { }
