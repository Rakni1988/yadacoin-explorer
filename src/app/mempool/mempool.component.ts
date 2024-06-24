// mempool.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateFormatService } from '../services/date-format.service';
import { TransactionUtilsService } from '../services/transaction-utils.service';

@Component({
  selector: 'app-mempool',
  templateUrl: './mempool.component.html',
  styleUrls: ['./mempool.component.css']
})
export class MempoolComponent implements OnInit {
  mempoolData: any[] = [];
  expandedTransaction: any = null;
  showAccordion: string | null = null;

  constructor(
    private httpClient: HttpClient,
    public dateFormatService: DateFormatService,
    public transactionUtilsService: TransactionUtilsService
  ) {}

  ngOnInit(): void {
    this.httpClient.get('/explorer-mempool')
      .subscribe((res: any) => {
        this.mempoolData = res.result || [];
      },
      (err: any) => {
        console.error('Error fetching mempool data:', err);
      });
  }

  toggleDetails(transaction: any): void {
    if (this.expandedTransaction === transaction) {
      this.expandedTransaction = null;
    } else {
      this.expandedTransaction = transaction;
    }
  }

  toggleAccordion(accordion: string): void {
    if (this.showAccordion === accordion) {
      this.showAccordion = null;
    } else {
      this.showAccordion = accordion;
    }
  }

  getTotalValue(outputs: any[]): number {
    return outputs.reduce((total, output) => total + output.value, 0);
  }
}