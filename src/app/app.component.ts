import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Search } from './search';
import { DateFormatService } from './services/date-format.service';
import { TransactionUtilsService } from './services/transaction-utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'explorer';
  model = new Search();
  result: any[] = [];
  searchedId = '';
  searchedHash = '';
  blocks: any[] = [];
  selectedBlock: any;
  showBlockTransactions = false;
  showBlockTransactionDetails: boolean[][] = [[]];
  resultType = '';
  balance = 0;
  searching = false;
  submitted = false;
  current_height = '';
  circulating = '';
  hashrate = '';
  difficulty = '';
  selectedOption = 'Main Page';
  showAccordion: string | null = null;
  isCollapsed = true;
  paginatedResult: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  maxVisiblePages: number = 10;
  visiblePages: Array<number | string> = [];
  prevResultLength: number = 0;
  prevCurrentPage: number = 0;
  targetPage: number = 1;


  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    public dateFormatService: DateFormatService,
    public transactionUtilsService: TransactionUtilsService
  ) {
    this.httpClient.get('/api-stats')
      .subscribe(
        (res: any) => {
          this.difficulty = this.numberWithCommas(res.stats.difficulty);
          this.hashrate = this.formatHashrate(res.stats.network_hash_rate);
          this.current_height = this.numberWithCommas(res.stats.height);
          this.circulating = this.numberWithCommas(res.stats.circulating);
        },
        (err: any) => {
          console.error('Error fetching API stats:', err);
          alert('Something went wrong while fetching API stats!');
        }
      );

    this.route.queryParams.subscribe(params => {
      const term = params['term'];
      if (term) {
        this.model = new Search({ term });
        this.onSubmit();
        this.selectedOption = 'SearchResults';
      }
    });

    if (window.location.search) {
      this.searching = true;
      this.submitted = true;
      this.httpClient.get('/explorer-search' + window.location.search)
        .subscribe(
          (res: any) => {
            this.result = res.result || [];
            this.resultType = res.resultType;
            this.balance = res.balance;
            this.searchedId = res.searchedId;
            this.searchedHash = res.searchedHash;
            this.searching = false;
            this.selectedOption = 'SearchResults';
            this.paginate();
            this.updateVisiblePages(); 
          },
          (err: any) => {
            console.error('Error fetching explorer search:', err);
            alert('Something went wrong while fetching explorer search results!');
          }
        );
    }
  }




  ngOnInit() {}

  onSubmit() {
    this.searching = true;
    this.submitted = true;

    const searchTerm = encodeURIComponent(this.model.term);
    const apiUrl = `/explorer-search?term=${searchTerm}`;

    this.httpClient.get(apiUrl)
      .subscribe(
        (res: any) => {
          this.result = res.result || [];
          this.resultType = res.resultType;
          this.balance = res.balance;
          this.searchedId = res.searchedId;
          this.searchedHash = res.searchedHash;
          this.searching = false;
          this.selectedOption = 'SearchResults';
          this.paginate();
          this.updateVisiblePages(); 

          this.selectedOption = 'SearchResults';
        },
        (err: any) => {
          console.error('Error fetching explorer search:', err);
          alert('Something went wrong while fetching explorer search results!');
          this.searching = false;
        }
      );
  }

  showBlockDetails(block: any) {
    console.log('Clicked block:', block);
    this.selectedBlock = block;
  }

  toggleAccordion(accordion: string): void {
    if (this.showAccordion === accordion) {
      this.showAccordion = null;
    } else {
      this.showAccordion = accordion;
    }
  }

  toggleDetails(block: any) {
    if (block.expanded) {
      block.expanded = false;
    } else {
      this.blocks.forEach(b => (b.expanded = false));

      block.expanded = true;

      const blockIndex = this.blocks.indexOf(block);
      this.showBlockTransactionDetails[blockIndex] = this.showBlockTransactionDetails[blockIndex] || [];

      this.selectedBlock = block;
    }
  }

  showTransactions() {
    this.showBlockTransactions = !this.showBlockTransactions;
    this.showBlockTransactionDetails = [];
  }

  showTransactionDetails(blockIndex: number, transactionIndex: number) {
    console.log('Clicked transaction:', blockIndex, transactionIndex);

    if (!this.showBlockTransactionDetails[blockIndex]) {
      this.showBlockTransactionDetails[blockIndex] = [];
    }

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

  selectOption(option: string) {
    this.selectedOption = option;
  }

  logButtonClick() {
    console.log('Button clicked!');
  }

  isSearchedItem(item: string): boolean {
    return item.toLowerCase() === this.searchedId.toLowerCase();
  }

  paginate() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedResult = this.result.slice(startIndex, endIndex);
    }

  changePage(page: number | string) {
    this.currentPage = +page;
    this.paginate();

    if (this.result.length !== this.prevResultLength || this.currentPage !== this.prevCurrentPage) {
      this.updateVisiblePages();
      this.prevResultLength = this.result.length;
      this.prevCurrentPage = this.currentPage;
    }
  }

  get calculateTotalPages() {
    const total = Math.ceil(this.result.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  updateVisiblePages(): void {
    console.log("Entering updateVisiblePages");
    const totalPageCount = this.calculateTotalPages.length;

    let visiblePages: Array<number | string> = [1];

    if (totalPageCount <= this.maxVisiblePages) {
      visiblePages = visiblePages.concat(this.calculateTotalPages.slice(1));
    } else {
      const buffer = Math.floor((this.maxVisiblePages - 3) / 2);
      let start = Math.max(2, this.currentPage - buffer);
      let end = Math.min(start + this.maxVisiblePages - 4, totalPageCount - 1);

      if (end === totalPageCount - 1) {
        start = Math.max(2, totalPageCount - this.maxVisiblePages + 3);
      }

      if (start > 2) {
        visiblePages.push('...');
      }

      visiblePages = visiblePages.concat(Array.from({ length: end - start + 1 }, (_, i) => start + i));

      if (end < totalPageCount - 1) {
        visiblePages.push('...');
        visiblePages.push(totalPageCount);
      }
    }

    this.visiblePages = visiblePages;
    console.log("Exiting updateVisiblePages");
  }

  goToPage(): void {
    if (this.targetPage >= 1 && this.targetPage <= this.calculateTotalPages.length) {
      this.changePage(this.targetPage);
      this.targetPage = this.currentPage;
    }
  }

  private isCalculatingTotalPages = false;
}