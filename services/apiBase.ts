const isNative = typeof (window as any)?.Capacitor !== 'undefined';
export const API_BASE = isNative ? 'https://www.amaphupho.co.za' : '';
