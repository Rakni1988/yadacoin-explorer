// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateFormatService } from './services/date-format.service';
import { ReplaceCommaPipe } from './pipes/replace-comma.pipe';
import { TransactionUtilsService } from './services/transaction-utils.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MempoolComponent } from './mempool/mempool.component';
import { AddressBalanceComponent } from './address-balance/address-balance.component';
import { LatestBlocksComponent } from './latest-blocks/latest-blocks.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MempoolComponent,
    AddressBalanceComponent,
    LatestBlocksComponent,
    ReplaceCommaPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCollapseModule
  ],
  providers: [DateFormatService, TransactionUtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
