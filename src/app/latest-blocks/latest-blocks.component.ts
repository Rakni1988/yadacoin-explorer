// latest-blocks.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateFormatService } from '../services/date-format.service';
import { TransactionUtilsService } from '../services/transaction-utils.service';

@Component({
  selector: 'app-latest-blocks',
  templateUrl: './latest-blocks.component.html',
  styleUrls: ['./latest-blocks.component.css']
})
export class LatestBlocksComponent implements OnInit {
  blocks: any[] = [];
  selectedBlock: any;
  showBlockTransactions = false;
  showBlockTransactionDetails: boolean[][] = [];
  searching = false;
  showAccordion: string | null = null;

  constructor(
    private httpClient: HttpClient,
    public dateFormatService: DateFormatService,
    public transactionUtilsService: TransactionUtilsService
  ) {}

  ngOnInit() {
    this.loadLatestBlocks();
  }

  loadLatestBlocks() {
    this.httpClient.get('/explorer-latest')
      .subscribe(
        (res: any) => {
          this.blocks = res.result || [];
          this.searching = false;
        },
        (err: any) => {
          console.error('Error fetching latest blocks:', err);
          alert('Something went wrong while fetching latest blocks!');
        }
      );
  }

  showBlockDetails(block: any) {
    console.log('Clicked block:', block);
    this.selectedBlock = block;
  }

  toggleDetails(block: any) {
    if (block.expanded) {
      block.expanded = false;
    } else {
      this.blocks.forEach(b => (b.expanded = false));

      block.expanded = true;

      const blockIndex = this.blocks.indexOf(block);
      this.showBlockTransactionDetails[blockIndex] = [];

      this.selectedBlock = block;
    }
  }

  showTransactions() {
    this.showBlockTransactions = !this.showBlockTransactions;
    this.showBlockTransactionDetails = [];
  }

  showTransactionDetails(blockIndex: number, transactionIndex: number) {
    console.log('Clicked transaction:', blockIndex, transactionIndex);
    this.showBlockTransactionDetails[blockIndex][transactionIndex] = !this.showBlockTransactionDetails[blockIndex][transactionIndex];
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatHashrate(hashrate: number): string {
    if (hashrate < 1000) {
      return `${hashrate.toFixed(0)} h/s`;
    } else if (hashrate < 1000000) {
      return `${(hashrate / 1000).toFixed(2)} kh/s`;
    } else {
      return `${(hashrate / 1000000).toFixed(2)} mh/s`;
    }
  }

  calculateAge(timestamp: number): string {
    const currentTime = new Date().getTime();
    const blockTime = new Date(timestamp * 1000).getTime();

    console.log('Current Time:', new Date(currentTime));
    console.log('Block Time:', new Date(blockTime));

    const difference = currentTime - blockTime;
    const ageInMinutes = Math.floor(difference / (1000 * 60));

    console.log('Difference:', difference);
    console.log('Age in Minutes:', ageInMinutes);

    if (ageInMinutes < 60) {
      return `${ageInMinutes} minutes ago`;
    } else {
      const ageInHours = Math.floor(ageInMinutes / 60);
      return `${ageInHours} hours ago`;
    }
  }

  getTotalValue(outputs: any[]): number {
    return outputs.reduce((total, output) => total + output.value, 0);
  }

  toggleAccordion(accordion: string): void {
    if (this.showAccordion === accordion) {
      this.showAccordion = null;
    } else {
      this.showAccordion = accordion;
    }
  }
}