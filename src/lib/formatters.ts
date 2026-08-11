import { CurrencyCode } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  } else if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  } else {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }
}

export function formatCompactCurrency(amount: number, currency: CurrencyCode = 'VND'): string {
  if (currency === 'VND') {
    if (Math.abs(amount) >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}Tỷ`;
    }
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return `${amount}₫`;
  }
  return formatCurrency(amount, currency);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '00:00';
  return timeString;
}

export function getMonthName(periodKey: string): string {
  // periodKey e.g. "2026-08"
  const parts = periodKey.split('-');
  if (parts.length === 2) {
    return `Tháng ${parseInt(parts[1], 10)}/${parts[0]}`;
  }
  return periodKey;
}
