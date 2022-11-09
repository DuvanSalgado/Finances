import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from '@app/core/services/loading.service';
import { ModalController } from '@ionic/angular';
import { IcreditModel } from '@credit/model/credit.interface';
import { mensages } from '@credit/model/menssage';
import { CalculateService } from '@credit/service/calculate.service';
import { LoansModel } from '@creditLoans/model/loans.model';
import { LoansService } from '@creditLoans/services/loans.service';

@Component({
  selector: 'app-loans-cash',
  templateUrl: './loans-cash.component.html',
  styleUrls: ['../loans.component.scss'],
})
export class LoansCashComponent extends LoansModel implements OnInit, OnDestroy {

  constructor(
    private loansService: LoansService,
    private loadingService: LoadingService,
    private calculateService: CalculateService,
    protected modalController: ModalController,
    protected formBuilder: FormBuilder,
  ) {
    super(formBuilder, modalController);
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.getData();
  }

  public valueChanges(month: number): void {
    this.monthSelect = this.month !== month;
    if (!this.monthSelect) { this.getData(); }
    else { this.getDataMonth(month); }
  }

  public async openModalPaymentsCash(data: IcreditModel): Promise<void> {
    await this.getTotal(data.month);
    this.formLoansPayments(data);
    this.disableButton = true;
    await this.openModalPaymentsController();
    this.disableButton = await (await this.modalPayments.onWillDismiss()).data;
    if (this.formGroup.valid) { this.updatePaymentsCash(); }
    else { this.resetFormPayments(); }
  }

  public async openModalAddValue(data: IcreditModel): Promise<void> {
    await this.getTotal(data.month);
    this.formLoansAddValue(data);
    this.disableButton = true;
    await this.openModalAddValueController();
    this.disableButton = await (await this.modalAddValue.onWillDismiss()).data;
    if (this.formGroup.valid) { this.addValueCash(); }
    else { this.resetFormAddValue(); }
  }

  public async openModalCreate(): Promise<void> {
    this.getTotal(this.month);
    this.formLoansCreate();
    this.formLoansCash();
    this.disableButton = true;
    await this.openModalCreateController();
    this.disableButton = await (await this.modalCreate.onWillDismiss()).data;
    if (this.formGroup.valid) { this.saveloansCash(); }
    else { this.resetFormCreate(); }
  }

  private async addValueCash(): Promise<void> {
    this.setHistoryLoan();
    this.patchValueItem();
    this.operations();
    this.loadingService.presentLoading();

    try {
      await this.calculateService.calculate(this.total, this.month);
      await this.calculateService.cashGeneral(this.cashGeneral);
      await this.loansService.updateCredit(this.formGroup.value, 'loansCash');
    } catch (error) {
      this.loadingService.presentToast(error);
    }

    this.loadingService.presentToast(mensages.update);
    this.resetFormAddValue();
    this.loadingService.dismiss();

  }

  private async saveloansCash(): Promise<void> {
    this.setHistoryLoan();
    this.patchValueItem();
    this.operations();
    this.loadingService.presentLoading();

    try {
      await this.calculateService.calculate(this.total, this.month);
      await this.calculateService.cashGeneral(this.cashGeneral);
      await this.loansService.createLoans(this.formGroup.value, 'loansCash');
    } catch (error) {
      this.loadingService.presentToast(error);
    }

    this.loadingService.presentToast(mensages.successful);
    this.resetFormCreate();
    this.loadingService.dismiss();
  }

  private async updatePaymentsCash(): Promise<void> {
    this.setHistoryPayment();
    this.patchValuePayments();
    this.operationsPayments();
    this.loadingService.presentLoading();

    try {
      if (this.isCash) { await this.calculateService.cashGeneral(this.cashGeneral); }
      await this.calculateService.calculate(this.total, this.month);
      await this.loansService.updateCredit(this.formGroup.value, 'loansCash');
      this.loadingService.presentToast(mensages.update);
    } catch (error) {
      this.loadingService.presentToast(error);
    }

    this.resetFormPayments();
    this.loadingService.dismiss();
  }

  private getData(): void {

    this.subscription = this.calculateService.getAllCash()
      .subscribe((cash) => {
        if (cash.length > 0) { this.cashGeneral = cash[0]; }
      }, (error) => this.loadingService.presentToast(error));

    this.subscription.add(this.loansService.getAllCredit('loansCash')
      .subscribe((loanCash: IcreditModel[]) => {
        this.loans = loanCash.filter(item =>
          (item.month == this.month) || (item.month != this.month && item.pendingValue > 0));
        this.loansAll = loanCash;
        this.loading = false;
      }, (error) => this.loadingService.presentToast(error)));
  }


  private async getTotal(month: number) {
    let dataPromise = await this.calculateService.getAllPromise(month);
    if (dataPromise) { this.total = dataPromise; }
  }

  private operationsPayments(): void {
    if (this.isCash) { this.cashGeneral.value = this.cashGeneral.value + this.getValue; }
    this.total.pendingCash = this.total.pendingCash - this.getValue;
    this.total.paymentCash = this.total.paymentCash + this.getValue;
  }

  private operations(): void {
    this.total.pendingCash = this.total.pendingCash + this.getValue;
    this.cashGeneral.value = this.cashGeneral.value - this.getValue;
  }

  private formLoansCash(): void {
    this.formGroup
      .patchValue({
        [this.formCtrl.icon]: { icon: 'cash-outline', labelColor: 'success' },
        [this.formCtrl.type]: 'Efectivo'
      });
  }

}
