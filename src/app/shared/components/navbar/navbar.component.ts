import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="logo">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="url(#navgrad)" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 2v20M3 7l9 5 9-5" stroke="url(#navgrad)" stroke-width="2" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="navgrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stop-color="#06b6d4"/>
                  <stop offset="50%" stop-color="#14b8a6"/>
                  <stop offset="100%" stop-color="#10b981"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">Quanti<span class="accent">Measure</span></span>
        </a>

        <button class="mobile-toggle" (click)="mobileOpen = !mobileOpen" [class.active]="mobileOpen">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-links" [class.open]="mobileOpen">
          <a routerLink="/calculator" routerLinkActive="active" (click)="mobileOpen = false">
            Calculator
          </a>
          <a routerLink="/history" routerLinkActive="active" (click)="mobileOpen = false">
            History
            <span class="lock-pill" *ngIf="!(auth.authState$ | async)">Lock</span>
          </a>

          <div class="nav-auth" *ngIf="!(auth.authState$ | async)">
            <a routerLink="/login" class="btn-login" (click)="mobileOpen = false">Log in</a>
            <a routerLink="/register" class="btn-register" (click)="mobileOpen = false">
              Sign up
              <span class="arrow">→</span>
            </a>
          </div>

          <div class="nav-auth" *ngIf="auth.authState$ | async">
            <div class="user-chip">
              <span class="avatar">{{ (auth.getUserName() || 'U')[0] | uppercase }}</span>
              <span class="name">{{ auth.getUserName() }}</span>
            </div>
            <button class="btn-logout" (click)="logout()">Log out</button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      height: 76px;
      background: rgba(236, 254, 255, 0.75);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(20, 184, 166, 0.1);
    }

    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      transition: transform 0.25s var(--ease);
    }
    .logo:hover {
      transform: translateX(-2px);
    }
    .logo-mark {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-mark svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 8px rgba(20, 184, 166, 0.3));
    }
    .logo-text {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.5px;
      color: var(--text);
    }
    .logo-text .accent {
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-links > a {
      padding: 10px 18px;
      border-radius: 999px;
      font-weight: 500;
      font-size: 14px;
      color: var(--text-secondary);
      transition: all 0.2s var(--ease);
      display: flex;
      align-items: center;
      gap: 6px;
      position: relative;
    }
    .nav-links > a:hover {
      color: var(--text);
      background: rgba(20, 184, 166, 0.08);
    }
    .nav-links > a.active {
      color: var(--teal-dark);
      background: rgba(20, 184, 166, 0.12);
    }
    .nav-links > a.active::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--teal);
      box-shadow: 0 0 8px var(--teal);
    }

    .lock-pill {
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 600;
      border-radius: 999px;
      background: var(--text-muted);
      color: #fff;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid var(--border-light);
    }

    .btn-login {
      padding: 10px 20px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      color: var(--teal-dark) !important;
      border-radius: 999px !important;
      transition: all 0.2s var(--ease);
    }
    .btn-login:hover {
      background: rgba(20, 184, 166, 0.08) !important;
    }

    .btn-register {
      padding: 10px 20px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      color: #fff !important;
      background: var(--grad-primary);
      border-radius: 999px !important;
      background-size: 200% 100%;
      transition: all 0.3s var(--ease);
      box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-register:hover {
      background-position: 100% 0;
      box-shadow: 0 6px 24px rgba(20, 184, 166, 0.5);
      transform: translateY(-1px);
    }
    .btn-register .arrow {
      transition: transform 0.2s;
    }
    .btn-register:hover .arrow {
      transform: translateX(3px);
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px 5px 5px;
      background: var(--grad-soft);
      border: 1px solid var(--accent-border);
      border-radius: 999px;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--grad-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }
    .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--teal-dark);
    }

    .btn-logout {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      border-radius: 999px;
      transition: all 0.2s var(--ease);
    }
    .btn-logout:hover {
      color: var(--danger);
      background: var(--danger-light);
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 8px;
    }
    .mobile-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--teal-dark);
      border-radius: 2px;
      transition: all 0.25s var(--ease);
    }
    .mobile-toggle.active span:nth-child(1) { transform: rotate(45deg) translateY(7px); }
    .mobile-toggle.active span:nth-child(2) { opacity: 0; }
    .mobile-toggle.active span:nth-child(3) { transform: rotate(-45deg) translateY(-7px); }

    @media (max-width: 768px) {
      .mobile-toggle { display: flex; }
      .nav-links {
        position: absolute;
        top: 76px;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(24px);
        flex-direction: column;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-light);
        box-shadow: var(--shadow-lg);
        display: none;
        align-items: stretch;
      }
      .nav-links.open { display: flex; }
      .nav-auth {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
        padding-top: 16px;
        margin-top: 8px;
        border-top: 1px solid var(--border-light);
      }
    }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  mobileOpen = false;

  logout(): void {
    this.auth.logout();
    this.mobileOpen = false;
    this.router.navigate(['/']);
  }
}
