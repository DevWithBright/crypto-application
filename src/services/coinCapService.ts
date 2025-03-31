
import { toast } from "@/components/ui/sonner";

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

export const fetchAssets = async (): Promise<Asset[]> => {
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?limit=50');
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    toast.error('Failed to load cryptocurrency data');
    return [];
  }
};

export const fetchAssetById = async (id: string): Promise<Asset | null> => {
  try {
    const response = await fetch(`https://api.coincap.io/v2/assets/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset with id: ${id}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    toast.error('Failed to load asset details');
    return null;
  }
};

export const fetchAssetHistory = async (
  id: string,
  interval = 'd1',
  days = 30
): Promise<AssetHistory[]> => {
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;
  
  try {
    const response = await fetch(
      `https://api.coincap.io/v2/assets/${id}/history?interval=${interval}&start=${start}&end=${now}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch history for asset: ${id}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    toast.error('Failed to load price history');
    return [];
  }
};

export const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '$0.00';
  
  // For values less than 0.01
  if (Math.abs(num) < 0.01 && num !== 0) {
    return '$' + num.toExponential(2);
  }
  
  // Format based on size
  if (Math.abs(num) >= 1e9) {
    return '$' + (num / 1e9).toFixed(2) + 'B';
  } else if (Math.abs(num) >= 1e6) {
    return '$' + (num / 1e6).toFixed(2) + 'M';
  } else if (Math.abs(num) >= 1e3) {
    return '$' + (num / 1e3).toFixed(2) + 'K';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(num);
};

export const formatLargeNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
};
