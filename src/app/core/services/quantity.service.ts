import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuantityDTO,
  QuantityInputDTO,
  ConvertDTO,
  HistoryRecord,
  Stats,
} from '../models/quantity.model';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private base = 'http://localhost:5042/api/quantity';

  constructor(private http: HttpClient) {}

  compare(input: QuantityInputDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.base}/compare`, input);
  }

  add(input: QuantityInputDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.base}/add`, input);
  }

  subtract(input: QuantityInputDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.base}/subtract`, input);
  }

  divide(input: QuantityInputDTO): Observable<number> {
    return this.http.post<number>(`${this.base}/divide`, input);
  }

  convert(input: ConvertDTO): Observable<QuantityDTO> {
    return this.http.post<QuantityDTO>(`${this.base}/convert`, input);
  }

  getHistory(): Observable<HistoryRecord[]> {
    return this.http.get<HistoryRecord[]>(`${this.base}/history`);
  }

  getHistoryByOperation(op: string): Observable<HistoryRecord[]> {
    return this.http.get<HistoryRecord[]>(`${this.base}/history/operation/${op}`);
  }

  getHistoryByType(type: string): Observable<HistoryRecord[]> {
    return this.http.get<HistoryRecord[]>(`${this.base}/history/type/${type}`);
  }

  deleteHistory(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/history`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.base}/stats`);
  }
}
