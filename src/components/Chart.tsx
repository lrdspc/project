import React, { useEffect, useRef } from 'react';

const Chart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Sample data
    const revenueData = [12000, 19000, 15000, 21000, 25000, 23000, 18000, 27000, 29000, 32000, 30000, 35000];
    const usersData = [500, 600, 550, 700, 850, 900, 950, 1100, 1200, 1250, 1300, 1400];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Find max values for scaling
    const maxRevenue = Math.max(...revenueData) * 1.1;
    const maxUsers = Math.max(...usersData) * 1.1;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();

    // Draw grid lines
    const gridLines = 5;
    ctx.textAlign = 'right';
    ctx.font = '10px Arial';
    ctx.fillStyle = '#6b7280';

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#f3f4f6';
      ctx.stroke();

      // Y-axis labels (revenue)
      const revenueValue = Math.round(maxRevenue - (maxRevenue / gridLines) * i);
      ctx.fillText(`$${revenueValue}`, padding - 5, y + 3);
    }

    // Draw x-axis labels
    ctx.textAlign = 'center';
    const barWidth = chartWidth / months.length;
    
    months.forEach((month, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      ctx.fillText(month, x, height - padding + 15);
    });

    // Draw revenue line
    ctx.beginPath();
    revenueData.forEach((value, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      const y = padding + chartHeight - (value / maxRevenue) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add points to revenue line
    revenueData.forEach((value, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      const y = padding + chartHeight - (value / maxRevenue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw users line
    ctx.beginPath();
    usersData.forEach((value, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      const y = padding + chartHeight - (value / maxUsers) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add points to users line
    usersData.forEach((value, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      const y = padding + chartHeight - (value / maxUsers) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Add legend
    const legendX = width - padding - 150;
    const legendY = padding + 20;

    // Revenue legend
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 20, legendY);
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    ctx.fillText('Revenue', legendX + 30, legendY + 4);

    // Users legend
    ctx.beginPath();
    ctx.moveTo(legendX, legendY + 20);
    ctx.lineTo(legendX + 20, legendY + 20);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 20, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#374151';
    ctx.fillText('Users', legendX + 30, legendY + 24);

  }, []);

  return (
    <div className="w-full h-80">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-full"
      />
    </div>
  );
};

export default Chart;