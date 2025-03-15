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

      // Revenue labels on left
      const revenueValue = Math.round(maxRevenue - (maxRevenue / gridLines) * i);
      ctx.fillText(`$${revenueValue.toLocaleString()}`, padding - 5, y + 3);
    }

    // Draw month labels
    ctx.textAlign = 'center';
    const barWidth = chartWidth / months.length;

    months.forEach((month, i) => {
      const x = padding + barWidth * i + barWidth / 2;
      ctx.fillText(month, x, height - padding + 15);
    });

    // Draw revenue line
    ctx.beginPath();
    ctx.moveTo(
      padding + (chartWidth / revenueData.length) * 0.5,
      padding + chartHeight - (revenueData[0] / maxRevenue) * chartHeight
    );

    revenueData.forEach((value, i) => {
      const x = padding + (chartWidth / revenueData.length) * (i + 0.5);
      const y = padding + chartHeight - (value / maxRevenue) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw revenue points
    revenueData.forEach((value, i) => {
      const x = padding + (chartWidth / revenueData.length) * (i + 0.5);
      const y = padding + chartHeight - (value / maxRevenue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw users line
    ctx.beginPath();
    ctx.moveTo(
      padding + (chartWidth / usersData.length) * 0.5,
      padding + chartHeight - (usersData[0] / maxUsers) * chartHeight
    );

    usersData.forEach((value, i) => {
      const x = padding + (chartWidth / usersData.length) * (i + 0.5);
      const y = padding + chartHeight - (value / maxUsers) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw users points
    usersData.forEach((value, i) => {
      const x = padding + (chartWidth / usersData.length) * (i + 0.5);
      const y = padding + chartHeight - (value / maxUsers) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw legend
    const legendX = width - padding - 120;
    const legendY = padding + 20;

    // Revenue legend
    ctx.beginPath();
    ctx.rect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Revenue', legendX + 20, legendY + 10);

    // Users legend
    ctx.beginPath();
    ctx.rect(legendX, legendY + 20, 12, 12);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Users', legendX + 20, legendY + 30);

  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md">Monthly</button>
          <button className="px-3 py-1 text-sm text-gray-600 rounded-md">Quarterly</button>
          <button className="px-3 py-1 text-sm text-gray-600 rounded-md">Yearly</button>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        className="w-full h-64"
      ></canvas>
    </div>
  );
};

export default Chart; 