import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITEMSTYPE } from '@app/shared/combobox/model/data.combobox';
import { Iicons, ITotal } from '@credit/model/credit.interface';
import { FormExpensesCtrl } from '@credit/model/formCredit.enum';
import { mensages } from '@credit/model/menssage';
import { Status } from '@credit/model/status.enum';
import { CalculateService } from '@credit/service/calculate.service';
import { ExpensesService } from '@credit/service/expenses.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { format } from 'date-fns';

@Component({
  selector: 'app-modal-add-expenses',
  templateUrl: './modal-add-expenses.component.html',
})
export class ModalAddExpensesComponent implements OnInit {

  @Input() total: ITotal;

  public loading = false;
  public formGroup: FormGroup;
  public formCtrl = FormExpensesCtrl;
  public itemsType = ITEMSTYPE;

  private loadingModal: any;
  private todayDate = new Date();

  constructor(
    private modalController: ModalController,
    private formbuilder: FormBuilder,
    private calculateService: CalculateService,
    private expensesService: ExpensesService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  cancel(): void {
    this.modalController.dismiss(false);
  }

  public async onSaveChange(evet: boolean): Promise<void> {
    this.loading = true;
    await this.presentLoading();
    await this.calculate();
    await this.expensesService.create(this.formGroup.value);
    await this.presentToast(mensages.successful);
    this.loading = false;
    await this.loadingModal.dismiss();
    await this.modalController.dismiss();
  }

  private initializeForm(): void {
    this.formGroup = this.formbuilder.group({
      [this.formCtrl.value]: [null, Validators.required],
      [this.formCtrl.description]: [null, Validators.required],
      [this.formCtrl.operations]: [null, Validators.required],
      [this.formCtrl.date]: [format(this.todayDate, 'MMM dd yyyy')],
      [this.formCtrl.month]: [this.todayDate.getMonth()],
      [this.formCtrl.icon]: [null]
    });
  }

  private async calculate(): Promise<void> {
    const value = parseInt(this.formGroup.get(this.formCtrl.value).value, 10);
    const type = this.formGroup.get(this.formCtrl.operations).value.id;
    let icon: Iicons;

    if (type === Status.efectivo) {
      this.total.cash = this.total.cash - value;
      this.total.expenseCash = this.total.expenseCash + value;
      icon = { icon: 'cash-outline', labelColor: 'success' };
    }

    if (type === Status.credito) {
      this.total.expenseCredit = this.total.expenseCredit + value;
      this.total.loanCredit = this.total.loanCredit + value;
      icon = { icon: 'card-outline', labelColor: 'warning' };
    }

    if (type === Status.debito) {
      this.total.expenseDebit = this.total.expenseDebit + value;
      this.total.loanDebit = this.total.loanDebit + value;
      icon = { icon: 'reader-outline', labelColor: 'primary' };
    }

    this.formGroup.patchValue({ [this.formCtrl.icon]: icon });
    await this.calculateService.calculate(this.total);
  }

  private async presentToast(mensaje: string): Promise<void> {
    const toast = await this.toastController
      .create({ message: mensaje, duration: 1050, position: 'top' });
    toast.present();
  }

  private async presentLoading(): Promise<void> {
    this.loadingModal = await this.loadingController.create({
      message: 'Cargando...',
    });
    await this.loadingModal.present();
  }
}
