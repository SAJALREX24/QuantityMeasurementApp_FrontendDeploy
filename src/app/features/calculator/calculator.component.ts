import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { QuantityService } from '../../core/services/quantity.service';
import { CATEGORIES, CategoryConfig } from '../../core/config/measurement-config';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-wrapper">
      <div class="container">
        <div class="calc-header animate-in">
          <span class="pill">Calculator</span>
          <h1>Convert & <span class="gradient-text">compute</span></h1>
          <p>Pick a category, choose an operation, enter your values.</p>
        </div>

        <div class="calc-container animate-in" style="animation-delay: 0.1s">
          <!-- STEP 1: CATEGORY -->
          <section class="step">
            <div class="step-head">
              <span class="step-num">1</span>
              <span class="step-title">Category</span>
            </div>
            <div class="category-grid">
              <button
                *ngFor="let cat of categories"
                class="cat-card"
                [class.selected]="selectedCategory?.name === cat.name"
                (click)="selectCategory(cat)"
              >
                <div class="cat-letter" [style.background]="getGradient(cat.name)">
                  {{ cat.name[0] }}
                </div>
                <div class="cat-info">
                  <div class="cat-name">{{ cat.name }}</div>
                  <div class="cat-count">{{ cat.units.length }} units</div>
                </div>
                <div class="cat-check" *ngIf="selectedCategory?.name === cat.name">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          </section>

          <!-- STEP 2: OPERATION -->
          <section class="step" *ngIf="selectedCategory">
            <div class="step-head">
              <span class="step-num">2</span>
              <span class="step-title">Operation</span>
            </div>
            <div class="op-grid">
              <button
                *ngFor="let op of selectedCategory.operations"
                class="op-btn"
                [class.selected]="selectedOp === op"
                (click)="selectOperation(op)"
              >
                <span class="op-symbol">{{ getOpSymbol(op) }}</span>
                <span class="op-label">{{ op }}</span>
              </button>
            </div>
          </section>

          <!-- STEP 3: VALUES -->
          <section class="step" *ngIf="selectedOp">
            <div class="step-head">
              <span class="step-num">3</span>
              <span class="step-title">Values</span>
            </div>
            <div class="input-panel">
              <div class="input-group">
                <label>{{ selectedOp === 'Convert' ? 'Source' : 'Quantity 1' }}</label>
                <div class="input-row">
                  <input
                    type="number"
                    [(ngModel)]="value1"
                    placeholder="0"
                    class="num-input"
                  />
                  <select [(ngModel)]="unit1" class="unit-select">
                    <option value="" disabled>Unit</option>
                    <option *ngFor="let u of selectedCategory!.units" [value]="u">{{ u }}</option>
                  </select>
                </div>
              </div>

              <div class="input-group" *ngIf="selectedOp !== 'Convert'">
                <label>Quantity 2</label>
                <div class="input-row">
                  <input
                    type="number"
                    [(ngModel)]="value2"
                    placeholder="0"
                    class="num-input"
                  />
                  <select [(ngModel)]="unit2" class="unit-select">
                    <option value="" disabled>Unit</option>
                    <option *ngFor="let u of selectedCategory!.units" [value]="u">{{ u }}</option>
                  </select>
                </div>
              </div>

              <div class="input-group" *ngIf="selectedOp === 'Convert'">
                <label>Target unit</label>
                <select [(ngModel)]="targetUnit" class="unit-select full">
                  <option value="" disabled>Select target</option>
                  <option *ngFor="let u of selectedCategory!.units" [value]="u">{{ u }}</option>
                </select>
              </div>
            </div>

            <button class="calc-btn" (click)="calculate()" [disabled]="loading">
              <span *ngIf="!loading">
                Calculate
                <span class="arrow">→</span>
              </span>
              <span *ngIf="loading" class="loading-wrap">
                <span class="spinner"></span> Calculating...
              </span>
            </button>
          </section>
        </div>

        <!-- RESULT -->
        <div class="result-section" *ngIf="resultReady">
          <div class="result-card" [ngClass]="resultClass">
            <div class="result-label">Result</div>
            <div class="result-value">{{ resultDisplay }}</div>
            <div class="result-detail" *ngIf="resultDetail">{{ resultDetail }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calc-header {
      text-align: center;
      margin-bottom: 48px;
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
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .calc-header h1 {
      font-family: var(--font-display);
      font-size: clamp(32px, 4.5vw, 48px);
      font-weight: 700;
      letter-spacing: -1.5px;
      color: var(--text);
      margin-bottom: 12px;
    }
    .calc-header p {
      color: var(--text-secondary);
      font-size: 16px;
    }

    // Container
    .calc-container {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 40px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }

    // Steps
    .step {
      margin-bottom: 36px;
      animation: slide-up 0.4s var(--ease) both;
    }
    .step:last-child { margin-bottom: 0; }
    .step-head {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .step-num {
      width: 28px;
      height: 28px;
      background: var(--grad-primary);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
    }
    .step-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
    }

    // Category cards
    .category-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .cat-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-md);
      text-align: left;
      transition: all 0.25s var(--ease);
      cursor: pointer;
    }
    .cat-card:hover {
      border-color: var(--teal);
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
    }
    .cat-card.selected {
      border-color: var(--teal);
      background: var(--grad-soft);
      box-shadow: var(--shadow-glow);
    }
    .cat-letter {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
    }
    .cat-info {
      flex: 1;
      min-width: 0;
    }
    .cat-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--text);
      margin-bottom: 2px;
    }
    .cat-count {
      font-size: 12px;
      color: var(--text-muted);
    }
    .cat-check {
      width: 24px;
      height: 24px;
      color: var(--teal);
      animation: scale-in 0.25s var(--ease-bounce);
    }
    .cat-check svg {
      width: 100%;
      height: 100%;
    }

    // Operations
    .op-grid {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .op-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-weight: 500;
      font-size: 14px;
      color: var(--text-secondary);
      transition: all 0.2s var(--ease);
    }
    .op-btn:hover {
      border-color: var(--teal);
      color: var(--teal-dark);
    }
    .op-btn.selected {
      background: var(--grad-primary);
      border-color: var(--teal);
      color: #fff;
      box-shadow: var(--shadow-glow);
    }
    .op-symbol {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 16px;
    }

    // Inputs
    .input-panel {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .input-group {
      flex: 1;
      min-width: 240px;
    }
    .input-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .input-row {
      display: flex;
      gap: 8px;
    }
    .num-input {
      flex: 1;
      padding: 14px 18px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 16px;
      color: var(--text);
      outline: none;
      transition: all 0.2s;
    }
    .num-input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
    }
    .unit-select {
      padding: 14px 16px;
      background: var(--bg-card);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
      outline: none;
      min-width: 130px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .unit-select:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
    }
    .unit-select.full {
      width: 100%;
    }

    // Calculate button
    .calc-btn {
      margin-top: 24px;
      padding: 16px 48px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border-radius: 14px;
      transition: all 0.3s var(--ease);
      min-width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: var(--shadow-glow);
    }
    .calc-btn:hover:not(:disabled) {
      background-position: 100% 0;
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow-lg);
    }
    .calc-btn:hover:not(:disabled) .arrow {
      transform: translateX(4px);
    }
    .calc-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .calc-btn .arrow {
      transition: transform 0.25s var(--ease);
    }

    .loading-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2.5px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    // Result
    .result-section {
      margin-top: 32px;
      animation: scale-in 0.4s var(--ease-bounce);
    }
    .result-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 40px;
      text-align: center;
      box-shadow: var(--shadow-glow);
      border: 1px solid var(--accent-border);
      position: relative;
      overflow: hidden;
    }
    .result-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      animation: gradient-shift 3s ease infinite;
    }
    .result-card.equal {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(6, 182, 212, 0.06));
    }
    .result-card.not-equal {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.05));
    }
    .result-card.not-equal::before {
      background: linear-gradient(90deg, #f59e0b, #ef4444);
    }
    .result-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .result-value {
      font-family: var(--font-display);
      font-size: 48px;
      font-weight: 700;
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    .result-card.not-equal .result-value {
      background: linear-gradient(135deg, #f59e0b, #ef4444);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .result-detail {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .calc-container { padding: 24px; }
      .category-grid { grid-template-columns: 1fr; }
      .input-panel { flex-direction: column; }
      .calc-btn { width: 100%; }
      .result-value { font-size: 36px; }
    }
  `],
})
export class CalculatorComponent {
  private svc = inject(QuantityService);
  private toastr = inject(ToastrService);

  categories = CATEGORIES;
  selectedCategory: CategoryConfig | null = null;
  selectedOp = '';

  value1: number | null = null;
  value2: number | null = null;
  unit1 = '';
  unit2 = '';
  targetUnit = '';

  loading = false;
  resultReady = false;
  resultDisplay = '';
  resultDetail = '';
  resultClass = '';

  private gradients: Record<string, string> = {
    Length: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    Weight: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    Volume: 'linear-gradient(135deg, #10b981, #059669)',
    Temperature: 'linear-gradient(135deg, #06b6d4, #10b981)',
  };

  getGradient(name: string): string {
    return this.gradients[name] || this.gradients['Length'];
  }

  selectCategory(cat: CategoryConfig): void {
    this.selectedCategory = cat;
    this.selectedOp = '';
    this.resetInputs();
  }

  selectOperation(op: string): void {
    this.selectedOp = op;
    this.resetInputs();
  }

  getOpSymbol(op: string): string {
    const map: Record<string, string> = {
      Compare: '=', Add: '+', Subtract: '-', Divide: '/', Convert: '~',
    };
    return map[op] || '';
  }

  calculate(): void {
    if (!this.validate()) return;
    this.loading = true;
    this.resultReady = false;

    const cat = this.selectedCategory!.name;

    if (this.selectedOp === 'Convert') {
      this.svc.convert({
        quantityOne: { value: this.value1!, unit: this.unit1, category: cat },
        targetUnit: this.targetUnit,
      }).subscribe({
        next: (res) => {
          this.resultDisplay = `${res.value} ${res.unit}`;
          this.resultDetail = `${this.value1} ${this.unit1} = ${res.value} ${res.unit}`;
          this.resultClass = '';
          this.done();
        },
        error: (err) => this.handleError(err),
      });
      return;
    }

    const input = {
      quantityOne: { value: this.value1!, unit: this.unit1, category: cat },
      quantityTwo: { value: this.value2!, unit: this.unit2, category: cat },
    };

    switch (this.selectedOp) {
      case 'Compare':
        this.svc.compare(input).subscribe({
          next: (equal) => {
            this.resultDisplay = equal ? 'Equal' : 'Not Equal';
            this.resultDetail = `${this.value1} ${this.unit1} ${equal ? '=' : '‰ '} ${this.value2} ${this.unit2}`;
            this.resultClass = equal ? 'equal' : 'not-equal';
            this.done();
          },
          error: (err) => this.handleError(err),
        });
        break;

      case 'Add':
        this.svc.add(input).subscribe({
          next: (res) => {
            this.resultDisplay = `${res.value} ${res.unit}`;
            this.resultDetail = `${this.value1} ${this.unit1} + ${this.value2} ${this.unit2}`;
            this.resultClass = '';
            this.done();
          },
          error: (err) => this.handleError(err),
        });
        break;

      case 'Subtract':
        this.svc.subtract(input).subscribe({
          next: (res) => {
            this.resultDisplay = `${res.value} ${res.unit}`;
            this.resultDetail = `${this.value1} ${this.unit1} - ${this.value2} ${this.unit2}`;
            this.resultClass = '';
            this.done();
          },
          error: (err) => this.handleError(err),
        });
        break;

      case 'Divide':
        this.svc.divide(input).subscribe({
          next: (ratio) => {
            this.resultDisplay = `${ratio}`;
            this.resultDetail = `Ratio: ${this.value1} ${this.unit1} / ${this.value2} ${this.unit2}`;
            this.resultClass = '';
            this.done();
          },
          error: (err) => this.handleError(err),
        });
        break;
    }
  }

  private validate(): boolean {
    if (this.value1 === null || this.value1 === undefined) {
      this.toastr.error('Enter a value for Quantity 1');
      return false;
    }
    if (!this.unit1) {
      this.toastr.error('Select a unit for Quantity 1');
      return false;
    }
    if (this.selectedOp === 'Convert') {
      if (!this.targetUnit) {
        this.toastr.error('Select a target unit');
        return false;
      }
    } else {
      if (this.value2 === null || this.value2 === undefined) {
        this.toastr.error('Enter a value for Quantity 2');
        return false;
      }
      if (!this.unit2) {
        this.toastr.error('Select a unit for Quantity 2');
        return false;
      }
    }
    return true;
  }

  private done(): void {
    this.loading = false;
    this.resultReady = true;
  }

  private handleError(err: any): void {
    this.loading = false;
    const msg = err?.error?.message || 'Something went wrong';
    this.toastr.error(msg);
  }

  private resetInputs(): void {
    this.value1 = null;
    this.value2 = null;
    this.unit1 = '';
    this.unit2 = '';
    this.targetUnit = '';
    this.resultReady = false;
    this.resultDisplay = '';
    this.resultDetail = '';
    this.resultClass = '';
  }
}
