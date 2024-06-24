// date-format.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatService {
  formatTransactionTime(timestamp: number): string {
    const transactionDate = new Date(timestamp * 1000);
    if (transactionDate.toString() === "Invalid Date") {
      console.error('Invalid Date Format:', timestamp);
      return "Invalid Date";
    }
    return transactionDate.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) + ', ' +
      transactionDate.toLocaleTimeString();
  }
}