// blockchain.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import BlockchainInfo from '../models/blockchain-info.model';
import Transaction from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  private apiUrl = 'TUTAJ_ADRES_API_DO_TWOJEGO_BLOCKCHAIN_EXPLORERA';

  constructor(private http: HttpClient) {}

  getBlockchainInfo(): Observable<BlockchainInfo> {
    return this.http.get<BlockchainInfo>(`${this.apiUrl}/blockchain-info`);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }
}