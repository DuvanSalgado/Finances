import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITotal } from '../model/credit.interface';

@Injectable()
export class CalculateService {

  private itemsCollection: AngularFirestoreCollection<any>;
  private month = new Date().getMonth();

  constructor(private fireBase: AngularFirestore) { }

  public getAll(): Observable<Array<ITotal>> {
    this.itemsCollection = this.fireBase.collection<any>('calculate', ref => ref.where('month', '>=', this.month));
    return this.itemsCollection.snapshotChanges().pipe(
      map(data => data.map((d) => {
        const retorno = {
          ...d.payload.doc.data(),
          id: d.payload.doc.id
        };
        return retorno;
      })));
  }

  public async calculate(data: ITotal): Promise<void | DocumentReference<any>> {
    this.itemsCollection = this.fireBase.collection<any>('calculate');
    if (data.id && data.month === this.month) {
      return await this.itemsCollection.doc(data.id).update(JSON.parse(JSON.stringify(data)));
    } else {
      return await this.itemsCollection.add(JSON.parse(JSON.stringify({ ...data, month: this.month })));
    }

  }
}
