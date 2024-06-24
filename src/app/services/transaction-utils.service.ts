import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransactionUtilsService {
  getTransactionType(transaction: any): string {
    if (transaction.inputs.length === 0 && transaction.outputs.length === 0) {
      console.log('Encrypted Message');
    }
    if (transaction.inputs.length === 0 && transaction.outputs.length === 1 && transaction.outputs[0]?.value === 0) {
      return 'Message';
    }
    if (transaction.inputs.length === 0 && transaction.outputs.length >= 1 && transaction.outputs[0]?.value > 0) {
      return 'Coinbase';
    }
    if (transaction.inputs.length > 0 && transaction.outputs.length >= 1 && transaction.outputs[0]?.value > 0) {
      return 'Transfer';
    }
    if (transaction.outputs.length >= 2 && transaction.outputs[0]?.value === 0) {
      return 'Create Identity';
    }
    console.log('Unknown Transaction Type');
    return 'Unknown Transaction Type';
  }

  isEncryptedMessageTransaction(transaction: any): boolean {
    return transaction.inputs.length === 0 && transaction.outputs.length === 0;
  }

  isMessageTransaction(transaction: any): boolean {
    return transaction.inputs.length === 0 && transaction.outputs.length === 1 && transaction.outputs[0]?.value === 0;
  }

  isCoinbaseTransaction(transaction: any): boolean {
    return transaction.inputs.length === 0 && transaction.outputs.length >= 1 && transaction.outputs[0]?.value > 0;
  }

  isTransferTransaction(transaction: any): boolean {
    return transaction.inputs.length > 0 && transaction.outputs.length >= 1 && transaction.outputs[0]?.value > 0;
  }

  isCreateIdentityTransaction(transaction: any): boolean {
    return transaction.outputs.length >= 2 && transaction.outputs[0]?.value === 0;
  }
}