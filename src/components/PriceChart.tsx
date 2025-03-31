
import { useEffect, useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { AssetHistory, formatCurrency } from "@/services/coinCapService";

interface PriceChartProps {
  data: AssetHistory[];
  color?: string;
}

const PriceChart = ({ data, color = "#3D00FF" }: PriceChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: new Date(item.time).toLocaleDateString(),
      price: parseFloat(item.priceUsd)
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="brutalist-container h-64 flex items-center justify-center">
        <p className="text-xl font-bold uppercase">No data available</p>
      </div>
    );
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="brutalist-container">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#000', fontWeight: '600' }}
              tickFormatter={formatXAxis}
            />
            <YAxis 
              tick={{ fill: '#000', fontWeight: '600' }}
              tickFormatter={(value) => formatCurrency(value).replace('$', '')}
              width={80}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), 'Price']}
              itemStyle={{ fontWeight: 'bold' }}
              contentStyle={{ 
                border: '3px solid #000', 
                borderRadius: '0',
                backgroundColor: '#fff',
                boxShadow: '4px 4px 0px #000'
              }}
              labelStyle={{ fontWeight: 'bold', textAlign: 'center' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8, fill: color, stroke: '#000', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
