import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoadingService } from '@app/core/services/loading.service';
import { AlertController, ModalController } from '@ionic/angular';
import { mensages } from '@credit/model/menssage';
import { CalculateService } from '@credit/service/calculate.service';
import { ExpenseModel } from '@creditExpenses/model/expense.model';
import { IExpensesModel } from '@creditExpenses/model/interfaces/expenses';
import { ExpensesService } from '@creditExpenses/services/expenses.service';

@Component({
  selector: 'app-expenses-credit',
  templateUrl: './expenses-credit.component.html',
  styleUrls: ['../expenses.component.scss'],
})
export class ExpensesCreditComponent extends ExpenseModel implements OnInit, OnDestroy {

  constructor(
    protected formBuilder: FormBuilder,
    protected modalController: ModalController,
    private expensesService: ExpensesService,
    private loadingService: LoadingService,
    private calculateService: CalculateService,
    private alertController: AlertController
  ) {
    super(formBuilder, modalController);
  }

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  ngOnInit(): void {
    this.getData(this.month);
    this.formExpenseCredit();
  }

  public async openModalCreate(): Promise<void> {
    this.disableButton = true;
    await this.openModalController();
    this.disableButton = await (await this.modal.onWillDismiss()).data;

    if (this.formGroup.valid) { this.saveExpensesCash(); }
    else { this.resetForm(); }
  }

  public valueChanges(month: number): void {
    this.loading = true;
    this.expenses = [];
    this.monthSelect = this.month !== month;
    this.getData(month);
  }

  public async deleteItem(item: IExpensesModel): Promise<void> {
    const alert = await this.alertController.create({
      header: '¿Esta seguro?',
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [{ text: 'No', role: 'cancel' },
      { text: 'Si', role: 'confirm', handler: () => this.deleteItemService(item) }]
    });
    await alert.present();
  }

  private async deleteItemService(item: IExpensesModel): Promise<void> {
    this.operationsDelete(item.value);
    try {
      await this.expensesService.deleteItem(item.id, 'ExpensesCredit');
      await this.calculateService.calculate(this.total);
    } catch (error) {
      this.loadingService.presentToast(error);
    }
  }

  private formExpenseCredit(): void {
    this.formGroup
      .patchValue({ [this.formCtrl.icon]: { icon: 'card-outline', labelColor: 'warning' } });
  }

  private getData(month: number): void {
    this.subscription = this.expensesService.getAllForMont(month, 'ExpensesCredit')
      .subscribe((data) => { this.expenses = data; this.loading = false; },
        (error) => this.loadingService.presentToast(error));

    this.subscription.add(this.calculateService.getAllTotal(month)
      .subscribe((calculate) => {
        if (calculate.length > 0) { this.total = calculate[0]; }
      }, (error) => this.loadingService.presentToast(error)));
  }

  private async saveExpensesCash(): Promise<void> {
    this.operationsCreate();
    this.loadingService.presentLoading();

    try {
      await this.calculateService.calculate(this.total, this.month);
      await this.expensesService.create(this.formGroup.value, 'ExpensesCredit');
      this.loadingService.presentToast(mensages.successful);
    } catch (error) {
      this.loadingService.presentToast(error);
    }

    this.resetForm();
    this.loadingService.dismiss();
  }

  private operationsCreate(): void {
    this.total.expenseCredit += this.getValue;
    this.total.totalCredit += this.getValue;
  }

  private operationsDelete(value: number): void {
    this.total.expenseCredit -= (+value);
    this.total.totalCredit -= (+value);
  }

}
