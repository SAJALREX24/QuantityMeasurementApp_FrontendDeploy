import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card animate-in">
        <div class="auth-header">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="url(#rg)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 2v20M3 7l9 5 9-5" stroke="url(#rg)" stroke-width="2" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stop-color="#06b6d4"/>
                  <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Create account</h1>
          <p>Join to save your measurement history</p>
        </div>

        <div class="form-group">
          <label for="name">Full name</label>
          <input
            id="name"
            type="text"
            [(ngModel)]="name"
            placeholder="John Doe"
            [class.invalid]="submitted && !name"
          />
          <span class="error" *ngIf="submitted && !name">Name is required</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            placeholder="you@example.com"
            [class.invalid]="submitted && !isEmailValid()"
          />
          <span class="error" *ngIf="submitted && !email">Email is required</span>
          <span class="error" *ngIf="submitted && email && !isEmailValid()">Invalid email format</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            [(ngModel)]="password"
            placeholder="Minimum 6 characters"
            [class.invalid]="submitted && password.length < 6"
          />
          <span class="error" *ngIf="submitted && !password">Password is required</span>
          <span class="error" *ngIf="submitted && password && password.length < 6">
            At least 6 characters
          </span>
        </div>

        <div class="form-group">
          <label for="phone">Mobile number</label>
          <input
            id="phone"
            type="tel"
            [(ngModel)]="phone"
            placeholder="10-digit number"
            [class.invalid]="submitted && !isPhoneValid()"
          />
          <span class="error" *ngIf="submitted && !phone">Mobile number is required</span>
          <span class="error" *ngIf="submitted && phone && !isPhoneValid()">
            Enter a valid 10-digit number
          </span>
        </div>

        <button class="auth-btn" (click)="register()" [disabled]="loading">
          <span *ngIf="!loading">
            Create account
            <span class="arrow">→</span>
          </span>
          <span *ngIf="loading" class="loading-wrap">
            <span class="spinner"></span> Creating...
          </span>
        </button>

        <div class="divider"><span>or</span></div>

        <p class="auth-switch">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 76px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 40px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      position: relative;
      overflow: hidden;
    }
    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      animation: gradient-shift 4s ease infinite;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo-mark {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px;
      filter: drop-shadow(0 4px 12px rgba(20, 184, 166, 0.3));
    }
    .logo-mark svg {
      width: 100%;
      height: 100%;
    }
    .auth-header h1 {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text);
      margin-bottom: 6px;
    }
    .auth-header p {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }
    .form-group input {
      width: 100%;
      padding: 13px 16px;
      background: var(--bg);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
      font-size: 15px;
      color: var(--text);
      outline: none;
      transition: all 0.2s;
    }
    .form-group input::placeholder {
      color: var(--text-muted);
    }
    .form-group input:focus {
      border-color: var(--teal);
      box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.15);
      background: var(--bg-card);
    }
    .form-group input.invalid {
      border-color: var(--danger);
    }
    .error {
      display: block;
      color: var(--danger);
      font-size: 12px;
      margin-top: 6px;
      font-weight: 500;
    }

    .auth-btn {
      width: 100%;
      padding: 14px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      margin-top: 12px;
      transition: all 0.3s var(--ease);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: var(--shadow-glow);
    }
    .auth-btn:hover:not(:disabled) {
      background-position: 100% 0;
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow-lg);
    }
    .auth-btn:hover:not(:disabled) .arrow {
      transform: translateX(4px);
    }
    .auth-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-btn .arrow {
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

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 24px 0 18px;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 500;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-light);
    }

    .auth-switch {
      text-align: center;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .auth-switch a {
      color: var(--teal-dark);
      font-weight: 600;
      margin-left: 4px;
      transition: all 0.2s;
    }
    .auth-switch a:hover {
      color: var(--teal);
      text-decoration: underline;
    }
  `],
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  name = '';
  email = '';
  password = '';
  phone = '';
  loading = false;
  submitted = false;

  isEmailValid(): boolean {
    if (!this.email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  isPhoneValid(): boolean {
    if (!this.phone) return false;
    return /^\d{10}$/.test(this.phone.replace(/\D/g, ''));
  }

  register(): void {
    this.submitted = true;
    if (!this.name || !this.isEmailValid() || this.password.length < 6 || !this.isPhoneValid()) {
      return;
    }

    this.loading = true;
    this.auth
      .register({
        username: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone.replace(/\D/g, ''),
      })
      .subscribe({
        next: () => {
          this.toastr.success('Account created! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err?.error?.message || 'Registration failed');
        },
      });
  }
}
