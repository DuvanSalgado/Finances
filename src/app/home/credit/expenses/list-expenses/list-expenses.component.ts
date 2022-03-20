import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ITotal } from '../../shared/model/credit.interface';
import { ModalAddExpensesComponent } from '../modal-add-expenses/modal-add-expenses.component';

@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.scss'],
})
export class ListExpensesComponent {

  @Input() total: Array<ITotal>;
  @Input() loading: boolean;

  constructor(private modalController: ModalController) { }

  async openModalCreate(): Promise<void> {

    const modal = await this.modalController.create({
      component: ModalAddExpensesComponent,
      componentProps: { total: this.total }
    });
    return await modal.present();
  }
}

