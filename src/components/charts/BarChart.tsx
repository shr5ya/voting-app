import React from 'react';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.datasets[0].data) * 1.1; // 10% headroom
  
  return (
    <div className="w-full h-full">
      <div className="flex h-full flex-col">
        <div className="flex justify-between mb-1 text-xs text-muted-foreground font-medium">
          {data.datasets.map((dataset, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="h-3 w-3 rounded-sm mr-1" 
                style={{ backgroundColor: dataset.backgroundColor }}
              />
              {dataset.label}
            </div>
          ))}
        </div>
        
        <div className="flex items-end justify-between h-full relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pr-2 text-xs text-muted-foreground">
            <span>{Math.round(maxValue).toLocaleString()}</span>
            <span>{Math.round(maxValue * 0.75).toLocaleString()}</span>
            <span>{Math.round(maxValue * 0.5).toLocaleString()}</span>
            <span>{Math.round(maxValue * 0.25).toLocaleString()}</span>
            <span>0</span>
          </div>
          
          {/* Horizontal grid lines */}
          <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-muted/20 w-full" />
            ))}
          </div>
          
          {/* Bars */}
          <div className="flex-1 flex items-end justify-between h-full pl-8">
            {data.datasets[0].data.map((value, index) => {
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center w-full">
                  <div 
                    className="w-6 rounded-t-sm mx-auto" 
                    style={{ 
                      height: `${height}%`, 
                      backgroundColor: data.datasets[0].backgroundColor,
                      minHeight: '4px',
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">{data.labels[index]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart; 