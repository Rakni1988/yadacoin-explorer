import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MempoolComponent } from './mempool/mempool.component';
import { AddressBalanceComponent } from './address-balance/address-balance.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'mempool', component: MempoolComponent },
  { path: 'address-balance', component: AddressBalanceComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }