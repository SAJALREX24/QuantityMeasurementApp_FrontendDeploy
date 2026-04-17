import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="badge animate-in">
              <span class="badge-dot"></span>
              Built for precision
            </span>

            <h1 class="hero-title animate-in" style="animation-delay: 0.1s">
              Convert anything,<br />
              <span class="gradient-text">beautifully.</span>
            </h1>

            <p class="hero-subtitle animate-in" style="animation-delay: 0.2s">
              A modern calculator for length, weight, volume, and temperature.
              Compare quantities, run arithmetic, or convert between units -
              all in a few taps.
            </p>

            <div class="hero-actions animate-in" style="animation-delay: 0.3s">
              <a routerLink="/calculator" class="btn-primary">
                Start calculating
                <span class="arrow">→</span>
              </a>
              <a routerLink="/register" class="btn-ghost">
                Create account
              </a>
            </div>

            <div class="trust-row animate-in" style="animation-delay: 0.4s">
              <div class="trust-item">
                <span class="trust-num">4</span>
                <span class="trust-label">categories</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <span class="trust-num">13</span>
                <span class="trust-label">units</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <span class="trust-num">5</span>
                <span class="trust-label">operations</span>
              </div>
            </div>
          </div>

          <div class="hero-visual animate-in" style="animation-delay: 0.2s">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <span class="preview-title">Quick convert</span>
              </div>
              <div class="preview-body">
                <div class="preview-row">
                  <div class="preview-label">From</div>
                  <div class="preview-input">
                    <span class="preview-val">100</span>
                    <span class="preview-unit">Celsius</span>
                  </div>
                </div>
                <div class="preview-arrow">†“</div>
                <div class="preview-row">
                  <div class="preview-label">To</div>
                  <div class="preview-input result">
                    <span class="preview-val">212</span>
                    <span class="preview-unit">Fahrenheit</span>
                  </div>
                </div>
              </div>
              <div class="preview-footer">
                <span class="dot live"></span>
                Real-time conversion
              </div>
            </div>

            <div class="float-blob blob-1"></div>
            <div class="float-blob blob-2"></div>
          </div>
        </div>
      </div>
    </div>

    <section class="features">
      <div class="container">
        <div class="section-header animate-in" style="animation-delay: 0.1s">
          <span class="section-badge">Categories</span>
          <h2>Four domains, endless possibilities</h2>
        </div>

        <div class="features-grid">
          <div
            class="feature-card animate-in"
            *ngFor="let f of features; let i = index"
            [style.animation-delay]="(0.2 + i * 0.1) + 's'"
          >
            <div class="card-icon" [style.background]="f.gradient">
              <span>{{ f.letter }}</span>
            </div>
            <h3>{{ f.name }}</h3>
            <p>{{ f.desc }}</p>
            <div class="card-units">
              <span class="unit-chip" *ngFor="let u of f.units">{{ u }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    // HERO
    .hero {
      padding: 80px 0 60px;
      position: relative;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--grad-soft);
      border: 1px solid var(--accent-border);
      color: var(--teal-dark);
      font-size: 13px;
      font-weight: 600;
      border-radius: 999px;
      margin-bottom: 28px;
    }
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--teal);
      box-shadow: 0 0 8px var(--teal);
      animation: pulse-glow 2s infinite;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(40px, 5.5vw, 68px);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -2px;
      color: var(--text);
      margin-bottom: 24px;
    }

    .hero-subtitle {
      font-size: 18px;
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 480px;
      margin-bottom: 36px;
    }

    .hero-actions {
      display: flex;
      gap: 14px;
      margin-bottom: 48px;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      color: #fff;
      font-weight: 600;
      font-size: 15px;
      border-radius: 14px;
      box-shadow: var(--shadow-glow);
      transition: all 0.3s var(--ease);
    }
    .btn-primary:hover {
      background-position: 100% 0;
      box-shadow: var(--shadow-glow-lg);
      transform: translateY(-2px);
    }
    .btn-primary .arrow {
      transition: transform 0.25s var(--ease);
    }
    .btn-primary:hover .arrow {
      transform: translateX(4px);
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 16px 32px;
      border: 1.5px solid var(--border);
      background: var(--bg-card);
      color: var(--text);
      font-weight: 600;
      font-size: 15px;
      border-radius: 14px;
      transition: all 0.25s var(--ease);
    }
    .btn-ghost:hover {
      border-color: var(--teal);
      color: var(--teal-dark);
      background: var(--accent-subtle);
      transform: translateY(-2px);
    }

    .trust-row {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .trust-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .trust-num {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 700;
      background: var(--grad-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }
    .trust-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .trust-divider {
      width: 1px;
      height: 32px;
      background: var(--border);
    }

    // HERO VISUAL
    .hero-visual {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 440px;
    }

    .float-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      z-index: -1;
    }
    .blob-1 {
      width: 240px;
      height: 240px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent);
      top: -20px;
      right: -20px;
      animation: float 6s ease-in-out infinite;
    }
    .blob-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent);
      bottom: -40px;
      left: 20px;
      animation: float 8s ease-in-out infinite reverse;
    }

    .preview-card {
      width: 100%;
      max-width: 380px;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(20, 184, 166, 0.1);
      overflow: hidden;
      position: relative;
      animation: float 5s ease-in-out infinite;
    }
    .preview-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-lg);
      padding: 1.5px;
      background: var(--grad-primary);
      background-size: 200% 100%;
      animation: gradient-shift 4s ease infinite;
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .preview-header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-light);
      gap: 12px;
    }
    .preview-dots {
      display: flex;
      gap: 6px;
    }
    .preview-dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .preview-dots span:nth-child(1) { background: #ff5f57; }
    .preview-dots span:nth-child(2) { background: #febc2e; }
    .preview-dots span:nth-child(3) { background: var(--emerald); }
    .preview-title {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .preview-body {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .preview-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .preview-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .preview-input {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 10px 18px;
      background: var(--bg);
      border: 1.5px solid var(--border-light);
      border-radius: var(--radius-sm);
    }
    .preview-input.result {
      background: var(--grad-soft);
      border-color: var(--teal);
    }
    .preview-val {
      font-family: var(--font-mono);
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
    }
    .preview-input.result .preview-val {
      color: var(--teal-dark);
    }
    .preview-unit {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .preview-arrow {
      text-align: center;
      color: var(--teal);
      font-size: 20px;
      font-weight: 700;
    }

    .preview-footer {
      padding: 12px 20px;
      background: var(--bg);
      border-top: 1px solid var(--border-light);
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot.live {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 8px var(--emerald);
      animation: pulse-glow 2s infinite;
    }

    // FEATURES
    .features {
      padding: 80px 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 56px;
    }
    .section-badge {
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
    .section-header h2 {
      font-family: var(--font-display);
      font-size: clamp(32px, 4vw, 44px);
      font-weight: 700;
      letter-spacing: -1px;
      color: var(--text);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 28px;
      transition: all 0.35s var(--ease);
      position: relative;
      overflow: hidden;
    }
    .feature-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--radius-lg);
      padding: 1.5px;
      background: var(--grad-primary);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
    }
    .feature-card:hover::before {
      opacity: 1;
    }

    .card-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 20px;
      box-shadow: 0 6px 20px rgba(20, 184, 166, 0.25);
    }

    .feature-card h3 {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 8px;
    }
    .feature-card p {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .card-units {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .unit-chip {
      padding: 4px 10px;
      background: var(--bg);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
      font-size: 11px;
      font-weight: 600;
      border-radius: 999px;
    }

    @media (max-width: 960px) {
      .hero-grid { grid-template-columns: 1fr; gap: 40px; }
      .hero-visual { height: auto; padding: 20px 0; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 520px) {
      .features-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; }
      .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
      .trust-row { justify-content: space-between; width: 100%; }
    }
  `],
})
export class HomeComponent {
  features = [
    {
      name: 'Length',
      letter: 'L',
      gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      desc: 'Measure distances across imperial and metric systems.',
      units: ['Inch', 'Feet', 'Yard', 'Cm'],
    },
    {
      name: 'Weight',
      letter: 'W',
      gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      desc: 'Convert between grams, kilograms, and tonnes with ease.',
      units: ['Gram', 'Kg', 'Tonne'],
    },
    {
      name: 'Volume',
      letter: 'V',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      desc: 'Handle liquid measurements from milliliters to gallons.',
      units: ['ML', 'Liter', 'Gallon'],
    },
    {
      name: 'Temp',
      letter: 'T',
      gradient: 'linear-gradient(135deg, #06b6d4, #10b981)',
      desc: 'Convert between Celsius, Fahrenheit, and Kelvin.',
      units: ['Â°C', 'Â°F', 'K'],
    },
  ];
}
