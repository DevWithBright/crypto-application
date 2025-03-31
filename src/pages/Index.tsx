
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Asset, fetchAssets } from "@/services/coinCapService";
import AssetCard from "@/components/AssetCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Navbar from "@/components/Navbar";
import { Bitcoin } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    staleTime: 60 * 1000, // 1 minute
  });
  
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (error) {
    return (
      <div className="min-h-screen bg-brutalist-gray">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="brutalist-container bg-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
            <p>Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-brutalist-gray">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="brutalist-container mb-12 bg-brutalist-yellow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h1 className="brutalist-title">CRYPTO ASSETS</h1>
                <p className="font-bold text-lg mt-8">
                  Top cryptocurrencies ranked by market cap
                </p>
              </div>
              <div className="flex-none">
                <Bitcoin size={100} className="text-brutalist-black" />
              </div>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="brutalist-input w-full"
            />
          </div>
        </header>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
            
            {filteredAssets.length === 0 && (
              <div className="col-span-full brutalist-container p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No assets found</h2>
                <p>Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
