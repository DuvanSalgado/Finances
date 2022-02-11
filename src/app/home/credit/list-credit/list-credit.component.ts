import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormCreditComponent } from '../form-credit/form-credit.component';
import { IcreditModel } from '../model/credit.interface';

@Component({
  selector: 'app-list-credit',
  templateUrl: './list-credit.component.html',
  styleUrls: ['./list-credit.component.scss'],
})
export class ListCreditComponent {

  items: any[] = [{
    name: 'duvan',
    value: '50.000',
    date: '10/10/2022'
  }, {
    name: 'duvan',
    value: '50.000',
    date: '10/10/2022'
  }, {
    name: 'duvan',
    value: '50.000',
    date: '10/10/2022'
  }, {
    name: 'duvan',
    value: '50.000',
    date: '10/10/2022'
  }];

  constructor(private modalController: ModalController) { }

  update(data: IcreditModel): void {
    this.openModal(data, false);
  }

  create(): void {
    this.openModal(null, true);
  }

  private async openModal(data: IcreditModel, isCreate: boolean): Promise<void> {
    const modal = await this.modalController.create({
      component: FormCreditComponent,
      componentProps: { data, isCreate }
    });
    return await modal.present();
  }

}
