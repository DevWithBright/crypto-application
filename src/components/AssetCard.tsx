
import { useState } from "react";
import { Link } from "react-router-dom";
import { Asset, formatCurrency } from "@/services/coinCapService";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetCardProps {
  asset: Asset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priceChangePercent = parseFloat(asset.changePercent24Hr);
  const isPriceUp = priceChangePercent >= 0;
  
  return (
    <Link 
      to={`/asset/${asset.id}`}
      className={`brutalist-card block transform 
        ${isHovered ? 'translate-x-[-4px] translate-y-[-4px]' : ''}
        transition-all duration-200 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-brutalist-black text-white font-bold w-8 h-8 flex items-center justify-center mr-3">
            {asset.rank}
          </div>
          <div>
            <h3 className="font-bold text-xl">{asset.name}</h3>
            <p className="text-sm uppercase font-bold text-gray-600">{asset.symbol}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-xl">{formatCurrency(asset.priceUsd)}</p>
          <div className={`flex items-center justify-end font-semibold text-sm ${isPriceUp ? 'text-green-600' : 'text-red-600'}`}>
            {isPriceUp ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>{Math.abs(priceChangePercent).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;
