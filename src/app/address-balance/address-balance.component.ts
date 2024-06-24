// address-balance.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-address-balance',
  templateUrl: './address-balance.component.html',
  styleUrls: ['./address-balance.component.css']
})
export class AddressBalanceComponent {

  address = '';
  balance = 0;
  loading = false;

  constructor(private httpClient: HttpClient) { }

  getBalance() {
    if (this.address) {
      this.loading = true;

      this.httpClient.get(`/explorer-get-balance?address=${this.address}`)
        .subscribe(
          (res: any) => {
            this.balance = res.balance;
            this.loading = false;
          },
          (err: any) => {
            alert('Something went wrong while fetching the balance.');
            this.loading = false;
          }
        );
    }
  }
}