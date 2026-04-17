import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { QuantityService } from '../../core/services/quantity.service';
import { HistoryRecord, Stats } from '../../core/models/quantity.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="container">

        <div class="history-header animate-in">
          <div class="header-main">
            <span class="pill">History</span>
            <h1>Your <span class="gradient-text">measurements</span></h1>
            <p>Every calculation, saved and organized.</p>
          </div>
          <button class="clear-btn" (click)="confirmDelete()" *ngIf="records.length > 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
            Clear all
          </button>
        </div>

        <!-- STATS -->
        <div class="stats-row animate-in" style="animation-delay:0.1s" *ngIf="stats">
          <div class="stat-card primary">
            <div class="stat-top">
              <span class="stat-label">Total operations</span>
              <span class="stat-trend">All time</span>
            </div>
            <div class="stat-number">{{ stats.totalOperations }}</div>
          </div>

          <div class="stat-card">
            <div class="stat-top">
              <span class="stat-label">By operation</span>
            </div>
            <div class="stat-list">
              <div class="stat-row" *ngFor="let op of stats.byOperation">
                <span class="stat-name">{{ op.operation }}</span>
                <span class="stat-count">{{ op.count }}</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-top">
              <span class="stat-label">By category</span>
            </div>
            <div class="stat-list">
              <div class="stat-row" *ngFor="let cat of stats.byCategory">
                <span class="stat-name">{{ cat.category }}</span>
                <span class="stat-count">{{ cat.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- FILTERS -->
        <div class="filters animate-in" style="animation-delay:0.15s">
          <div class="filter-group">
            <label>Operation</label>
            <select [(ngModel)]="filterOp" (ngModelChange)="applyFilters()">
              <option value="">All operations</option>
              <option value="Compare">Compare</option>
              <option value="Addition">Addition</option>
              <option value="Subtraction">Subtraction</option>
              <option value="Divide">Divide</option>
              <option value="Convert">Convert</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Category</label>
            <select [(ngModel)]="filterType" (ngModelChange)="applyFilters()">
              <option value="">All categories</option>
              <option value="Length">Length</option>
              <option value="Weight">Weight</option>
              <option value="Volume">Volume</option>
              <option value="Temperature">Temperature</option>
            </select>
          </div>
        </div>

        <!-- LOADING -->
        <div class="loading-state" *ngIf="loading">
          <div class="loader"></div>
          <p>Loading history...</p>
        </div>

        <!-- EMPTY -->
        <div class="empty-state animate-in" *ngIf="!loading && records.length === 0">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#eg)" stroke-width="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z"/>
              <defs>
                <linearGradient id="eg"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
              </defs>
            </svg>
          </div>
          <h3>No history yet</h3>
          <p>Start using the calculator to build your measurement history.</p>
        </div>

        <!-- TABLE -->
        <div class="table-wrap animate-in" style="animation-delay:0.2s" *ngIf="!loading && records.length > 0">
          <div class="table-header">
            <span class="record-count">{{ records.length }} records</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Operation</th>
                <th>Input 1</th>
                <th>Input 2</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of records; let i = index" [style.animation-delay]="(i * 0.02) + 's'">
                <td class="row-num">{{ i + 1 }}</td>
                <td><span class="badge cat-{{ r.category.toLowerCase() }}">{{ r.category }}</span></td>
                <td><span class="badge op">{{ r.operation }}</span></td>
                <td class="mono">{{ r.value1 }} <span class="unit">{{ r.unit1 }}</span></td>
                <td class="mono">{{ r.value2 }} <span class="unit">{{ r.unit2 }}</span></td>
                <td class="mono result">{{ formatResult(r) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- DELETE CONFIRM -->
        <div class="overlay" *ngIf="showDeleteConfirm" (click)="showDeleteConfirm = false">
          <div class="confirm-dialog" (click)="$event.stopPropagation()">
            <div class="warn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>Clear all history?</h3>
            <p>This permanently deletes all your measurement records. This action cannot be undone.</p>
            <div class="confirm-actions">
              <button class="btn-cancel" (click)="showDeleteConfirm = false">Cancel</button>
              <button class="btn-danger" (click)="deleteAll()">Delete all</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }
    .pill {
      display: inline-block;
      padding: 5px 14px;
      background: var(--grad-soft);
      border: 1px solid var(--accent-border);
      color: var(--teal-dark);
      font-size: 12px;
      font-weight: 600;
      border-radius: 999px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header-main h1 {
      font-family: var(--font-display);
      font-size: clamp(32px, 4vw, 44px);
      font-weight: 700;
      letter-spacing: -1px;
      margin-bottom: 6px;
    }
    .header-main p {
      color: var(--text-secondary);
      font-size: 15px;
    }

    .clear-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s var(--ease);
    }
    .clear-btn svg {
      width: 16px;
      height: 16px;
    }
    .clear-btn:hover {
      border-color: var(--danger);
      color: var(--danger);
      background: var(--danger-light);
    }

    // Stats
    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1.2fr 1.2fr;
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      padding: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      transition: all 0.25s var(--ease);
    }
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .stat-card.primary {
      background: var(--grad-primary);
      background-size: 200% 100%;
      animation: gradient-shift 8s ease infinite;
      border: none;
      color: #fff;
      box-shadow: var(--shadow-glow);
    }
    .stat-card.primary .stat-label,
    .stat-card.primary .stat-trend {
      color: rgba(255, 255, 255, 0.85);
    }
    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    .stat-trend {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .stat-number {
      font-family: var(--font-display);
      font-size: 48px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -1px;
    }
    .stat-card:not(.primary) .stat-number {
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 13px;
    }
    .stat-name {
      color: var(--text-secondary);
      font-weight: 500;
    }
    .stat-count {
      font-family: var(--font-mono);
      font-weight: 700;
      color: var(--teal-dark);
    }

    // Filters
    .filters {
      display: flex;
      gap: 14px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .filter-group {
      flex: 1;
      min-width: 220px;
    }
    .filter-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .filter-group select {
      width: 100%;
      padding: 12px 16px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-size: 14px;
      color: var(--text);
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .filter-group select:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
    }

    // Table
    .table-wrap {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    .table-header {
      padding: 14px 24px;
      border-bottom: 1px solid var(--border-light);
      background: var(--bg);
    }
    .record-count {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      padding: 14px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-light);
    }
    td {
      padding: 14px 20px;
      font-size: 14px;
      border-bottom: 1px solid var(--border-light);
    }
    tbody tr {
      opacity: 0;
      animation: slide-up 0.3s ease forwards;
      transition: background 0.15s;
    }
    tbody tr:hover td {
      background: var(--accent-subtle);
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .row-num {
      font-family: var(--font-mono);
      color: var(--text-muted);
      font-size: 12px;
      width: 50px;
    }
    .mono {
      font-family: var(--font-mono);
    }
    .unit {
      color: var(--text-muted);
      font-size: 12px;
    }
    .result {
      font-weight: 700;
      color: var(--teal-dark);
    }

    // Badges
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 999px;
      letter-spacing: 0.3px;
    }
    .cat-length { background: rgba(6, 182, 212, 0.12); color: #0891b2; }
    .cat-weight { background: rgba(20, 184, 166, 0.12); color: #0d9488; }
    .cat-volume { background: rgba(16, 185, 129, 0.12); color: #059669; }
    .cat-temperature { background: rgba(99, 102, 241, 0.12); color: #4338ca; }
    .badge.op {
      background: var(--bg);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }

    // Loading
    .loading-state {
      text-align: center;
      padding: 80px 20px;
    }
    .loader {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border-light);
      border-top-color: var(--teal);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 12px;
    }
    .loading-state p { color: var(--text-muted); font-size: 14px; }

    // Empty
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
    }
    .empty-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      padding: 16px;
      background: var(--grad-soft);
      border-radius: 50%;
      color: var(--teal);
    }
    .empty-icon svg {
      width: 100%;
      height: 100%;
    }
    .empty-state h3 {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .empty-state p {
      color: var(--text-muted);
      font-size: 14px;
    }

    // Confirm
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fade-in 0.2s ease;
    }
    .confirm-dialog {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 36px;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      text-align: center;
      animation: scale-in 0.25s var(--ease-bounce);
    }
    .warn-icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border-radius: 50%;
      color: var(--danger);
    }
    .warn-icon svg {
      width: 100%;
      height: 100%;
    }
    .confirm-dialog h3 {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .confirm-dialog p {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .confirm-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .btn-cancel {
      padding: 11px 22px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      color: var(--text-secondary);
      background: var(--bg-card);
      transition: all 0.2s;
    }
    .btn-cancel:hover {
      background: var(--bg);
      border-color: var(--text-muted);
    }
    .btn-danger {
      padding: 11px 22px;
      background: var(--danger);
      color: #fff;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    .btn-danger:hover {
      background: #dc2626;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      transform: translateY(-1px);
    }

    @media (max-width: 960px) {
      .stats-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      th, td { padding: 10px 14px; font-size: 13px; }
      .stat-number { font-size: 36px; }
    }
  `],
})
export class HistoryComponent implements OnInit {
  private svc = inject(QuantityService);
  private toastr = inject(ToastrService);

  records: HistoryRecord[] = [];
  stats: Stats | null = null;
  loading = true;
  filterOp = '';
  filterType = '';
  showDeleteConfirm = false;

  ngOnInit(): void {
    this.loadStats();
    this.loadHistory();
  }

  loadStats(): void {
    this.svc.getStats().subscribe({
      next: (s) => (this.stats = s),
      error: () => {},
    });
  }

  loadHistory(): void {
    this.loading = true;
    this.svc.getHistory().subscribe({
      next: (r) => {
        this.records = r;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load history');
      },
    });
  }

  applyFilters(): void {
    this.loading = true;
    if (this.filterOp && !this.filterType) {
      this.svc.getHistoryByOperation(this.filterOp).subscribe({
        next: (r) => { this.records = r; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else if (this.filterType && !this.filterOp) {
      this.svc.getHistoryByType(this.filterType).subscribe({
        next: (r) => { this.records = r; this.loading = false; },
        error: () => { this.loading = false; },
      });
    } else if (this.filterOp && this.filterType) {
      this.svc.getHistory().subscribe({
        next: (r) => {
          this.records = r.filter(
            (rec) =>
              rec.operation.toLowerCase() === this.filterOp.toLowerCase() &&
              rec.category.toLowerCase() === this.filterType.toLowerCase()
          );
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
    } else {
      this.loadHistory();
    }
  }

  formatResult(r: HistoryRecord): string {
    if (r.operation === 'Compare') {
      return r.result === 1 ? 'Equal' : 'Not Equal';
    }
    if (r.operation === 'Divide') {
      return `${r.result}`;
    }
    return `${r.result}`;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  deleteAll(): void {
    this.svc.deleteHistory().subscribe({
      next: () => {
        this.records = [];
        this.stats = null;
        this.showDeleteConfirm = false;
        this.toastr.success('History cleared');
        this.loadStats();
      },
      error: () => {
        this.toastr.error('Failed to delete');
        this.showDeleteConfirm = false;
      },
    });
  }
}
