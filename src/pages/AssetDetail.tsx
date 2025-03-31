
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchAssetById, 
  fetchAssetHistory, 
  formatCurrency, 
  formatLargeNumber 
} from "@/services/coinCapService";
import LoadingSpinner from "@/components/LoadingSpinner";
import PriceChart from "@/components/PriceChart";
import Navbar from "@/components/Navbar";
import { ArrowLeft, TrendingUp, TrendingDown, Info, DollarSign } from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [timeInterval, setTimeInterval] = useState<'m15' | 'h1' | 'd1'>('d1');
  const [days, setDays] = useState(30);
  
  const { data: asset, isLoading: isLoadingAsset } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => fetchAssetById(id!),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['assetHistory', id, timeInterval, days],
    queryFn: () => fetchAssetHistory(id!, timeInterval, days),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const isLoading = isLoadingAsset || isLoadingHistory;
  
  // Determine if price is up or down
  const priceChangePercent = asset ? parseFloat(asset.changePercent24Hr) : 0;
  const isPriceUp = priceChangePercent >= 0;
  const chartColor = isPriceUp ? '#00C853' : '#FF3D00';
  
  return (
    <div className="min-h-screen bg-brutalist-gray">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center font-bold text-lg hover:text-brutalist-blue transition-colors"
          >
            <ArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : asset ? (
          <>
            <div className="brutalist-container mb-8 bg-brutalist-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="brutalist-title">{asset.name}</h1>
                    <span className="text-2xl font-bold bg-brutalist-black text-white px-2 py-1">
                      {asset.symbol}
                    </span>
                    <span className="text-sm bg-brutalist-gray px-2 py-1 font-bold">
                      Rank #{asset.rank}
                    </span>
                  </div>
                  
                  <div className="flex items-end gap-3 mt-8">
                    <span className="text-4xl font-black">
                      {formatCurrency(asset.priceUsd)}
                    </span>
                    <span className={`flex items-center text-xl font-bold ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
                      {isPriceUp ? (
                        <TrendingUp className="h-6 w-6 mr-1" />
                      ) : (
                        <TrendingDown className="h-6 w-6 mr-1" />
                      )}
                      {Math.abs(priceChangePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="brutalist-container bg-brutalist-yellow p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-bold">Market Cap</span>
                    </div>
                    <span className="text-lg font-black">
                      {formatCurrency(asset.marketCapUsd)}
                    </span>
                  </div>
                  
                  <div className="brutalist-container bg-brutalist-yellow p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-bold">Supply</span>
                    </div>
                    <span className="text-lg font-black">
                      {formatLargeNumber(asset.supply)}
                    </span>
                  </div>
                  
                  <div className="brutalist-container bg-brutalist-yellow p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm font-bold">Volume (24h)</span>
                    </div>
                    <span className="text-lg font-black">
                      {formatCurrency(asset.volumeUsd24Hr)}
                    </span>
                  </div>
                  
                  <div className="brutalist-container bg-brutalist-yellow p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4" />
                      <span className="text-sm font-bold">VWAP (24h)</span>
                    </div>
                    <span className="text-lg font-black">
                      {formatCurrency(asset.vwap24Hr)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="brutalist-container bg-brutalist-white mb-6">
                <h2 className="text-2xl font-bold mb-4">Price Chart</h2>
                <div className="flex gap-4 mb-6">
                  <button
                    className={`px-4 py-2 font-bold border-2 border-black ${timeInterval === 'd1' ? 'bg-brutalist-yellow' : 'bg-white'}`}
                    onClick={() => { setTimeInterval('d1'); setDays(30); }}
                  >
                    1 Month
                  </button>
                  <button
                    className={`px-4 py-2 font-bold border-2 border-black ${timeInterval === 'h1' ? 'bg-brutalist-yellow' : 'bg-white'}`}
                    onClick={() => { setTimeInterval('h1'); setDays(7); }}
                  >
                    1 Week
                  </button>
                  <button
                    className={`px-4 py-2 font-bold border-2 border-black ${timeInterval === 'm15' ? 'bg-brutalist-yellow' : 'bg-white'}`}
                    onClick={() => { setTimeInterval('m15'); setDays(1); }}
                  >
                    1 Day
                  </button>
                </div>
                <PriceChart data={history} color={chartColor} />
              </div>
            </div>
          </>
        ) : (
          <div className="brutalist-container p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Asset Not Found</h2>
            <p>The asset you're looking for doesn't exist or couldn't be loaded.</p>
            <Link 
              to="/" 
              className="brutalist-button mt-6 inline-block"
            >
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetail;
