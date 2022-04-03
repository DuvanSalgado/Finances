import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IcreditModel, ITotal } from '../../shared/model/credit.interface';
import { CalculateService } from '../../shared/service/calculate.service';
import { CreditService } from '../../shared/service/credit.service';
import { ModalDetailsLoansComponent } from '../modal-details-loans/modal-details-loans.component';
import { ModalLoansComponent } from '../modal-loans/modal-loans.component';

@Component({
  selector: 'app-list-loans',
  templateUrl: './list-loans.component.html',
  styleUrls: ['./list-loans.component.scss'],
})
export class ListLoansComponent implements OnInit, OnDestroy {

  public loans: Array<IcreditModel> = [];
  public loading = true;

  private total: ITotal = {
    expenseCredit: 0,
    loanCredit: 0,
    cash: 0,
    paidCredit: 0,
    pendingCredit: 0,
    expenseDebit: 0,
    paidDebit: 0,
    pendingDebit: 0,
    loanDebit: 0,
    expenseCash: 0,
  };
  private subscription: Array<Subscription> = [];

  constructor(
    private modalController: ModalController,
    private creditService: CreditService,
    private calculateService: CalculateService,
  ) { }

  public ngOnInit(): void {
    this.getdata();
  }

  public ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public async view(data: IcreditModel): Promise<void> {
    const modal = await this.modalController.create({
      component: ModalDetailsLoansComponent,
      componentProps: { data }
    });
    return await modal.present();
  }

  public openModalCreate(): void {
    this.openModal(null, 'Crear un nuevo registro', true);
  }

  public update(data: IcreditModel): void {
    this.openModal(data, 'Actulización de datos', false);
  }

  private getdata(): void {
    this.subscription.push(this.creditService.getAllCredit()
      .subscribe((data) => { this.loading = false; this.loans = data; }));

    this.subscription.push(this.calculateService.getAll()
      .subscribe((data) => { if (data.length > 0) { this.total = data[0]; } }
      ));

  }

  private async openModal(data: IcreditModel, title: string, isCreate: boolean): Promise<void> {
    const modal = await this.modalController.create({
      component: ModalLoansComponent,
      componentProps: { data, isCreate, title, total: this.total }
    });
    return await modal.present();
  }

}
