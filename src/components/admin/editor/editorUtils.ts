
export const insertTableHtml = () => {
  return `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Header 1</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Header 2</th>
        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 12px;">Data 1</td>
        <td style="border: 1px solid #ddd; padding: 12px;">Data 2</td>
        <td style="border: 1px solid #ddd; padding: 12px;">Data 3</td>
      </tr>
    </tbody>
  </table>`;
};

export const insertCalloutHtml = () => {
  return `<div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 16px; margin: 20px 0; border-radius: 4px;"><strong>Key Insight:</strong> Add your important information here.</div>`;
};

export const createChartHtml = (chartData: any) => {
  const chartId = `chart-${Date.now()}`;
  return `<div class="chart-placeholder" data-chart='${JSON.stringify(chartData)}' data-chart-id="${chartId}" style="border: 2px dashed #ccc; padding: 20px; margin: 10px 0; text-align: center; background: #f9f9f9;">📊 Chart: ${chartData.title}</div>`;
};

export const createImageHtml = (imageUrl: string, caption?: string) => {
  return `<div class="image-container" style="margin: 20px 0; text-align: center;"><img src="${imageUrl}" alt="${caption || 'Report image'}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />${caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${caption}</p>` : ''}</div>`;
};
