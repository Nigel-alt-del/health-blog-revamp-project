
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, Image, Table, Quote } from 'lucide-react';
import { ChartBuilder } from './ChartBuilder';
import { MediaGallery } from './MediaGallery';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'blockquote', 'code-block', 'link', 'image'
  ];

  const insertChart = (chartData: any) => {
    const chartId = `chart-${Date.now()}`;
    const chartHtml = `<div class="chart-placeholder" data-chart='${JSON.stringify(chartData)}' data-chart-id="${chartId}" style="border: 2px dashed #ccc; padding: 20px; margin: 10px 0; text-align: center; background: #f9f9f9;">📊 Chart: ${chartData.title}</div>`;
    onChange(value + chartHtml);
    setShowChartBuilder(false);
  };

  const insertImage = (imageUrl: string, caption?: string) => {
    const imageHtml = `<div class="image-container" style="margin: 20px 0; text-align: center;"><img src="${imageUrl}" alt="${caption || 'Report image'}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />${caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 14px;">${caption}</p>` : ''}</div>`;
    onChange(value + imageHtml);
    setShowMediaGallery(false);
  };

  const insertTable = () => {
    const tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
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
    onChange(value + tableHtml);
  };

  const insertCallout = () => {
    const calloutHtml = `<div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 16px; margin: 20px 0; border-radius: 4px;"><strong>Key Insight:</strong> Add your important information here.</div>`;
    onChange(value + calloutHtml);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChartBuilder(true)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Add Chart
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMediaGallery(true)}
          >
            <Image className="mr-2 h-4 w-4" />
            Add Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={insertTable}
          >
            <Table className="mr-2 h-4 w-4" />
            Add Table
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={insertCallout}
          >
            <Quote className="mr-2 h-4 w-4" />
            Add Callout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight: '400px' }}
        />
        
        {showChartBuilder && (
          <ChartBuilder
            onInsert={insertChart}
            onClose={() => setShowChartBuilder(false)}
          />
        )}
        
        {showMediaGallery && (
          <MediaGallery
            onInsert={insertImage}
            onClose={() => setShowMediaGallery(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
