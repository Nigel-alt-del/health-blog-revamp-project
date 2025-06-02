
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, Image, Table, Quote, FileText, Plus } from 'lucide-react';
import { ChartBuilder } from '../ChartBuilder';
import { MediaGallery } from '../MediaGallery';

interface SimplifiedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const sectionTemplates = {
  introduction: `<h2>Introduction</h2><p>Provide an overview of the topic and why it's important...</p>`,
  keyFindings: `<h2>Key Findings</h2><ul><li>Finding 1: Description</li><li>Finding 2: Description</li><li>Finding 3: Description</li></ul>`,
  analysis: `<h2>Analysis</h2><p>Detailed analysis of the data and trends...</p>`,
  recommendations: `<h2>Recommendations</h2><ol><li>Recommendation 1</li><li>Recommendation 2</li><li>Recommendation 3</li></ol>`,
  conclusion: `<h2>Conclusion</h2><p>Summarize the main points and next steps...</p>`,
  methodology: `<h2>Methodology</h2><p>Explain how the research was conducted...</p>`
};

const fontFamilies = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Roboto', label: 'Roboto (Professional)' },
  { value: 'Open Sans', label: 'Open Sans (Friendly)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
  { value: 'Lora', label: 'Lora (Readable)' },
  { value: 'Arial', label: 'Arial (Classic)' },
  { value: 'Times New Roman', label: 'Times New Roman (Traditional)' }
];

const fontSizes = [
  { value: '12px', label: 'Small (12px)' },
  { value: '14px', label: 'Normal (14px)' },
  { value: '16px', label: 'Medium (16px)' },
  { value: '18px', label: 'Large (18px)' },
  { value: '24px', label: 'Extra Large (24px)' },
  { value: '32px', label: 'Huge (32px)' }
];

const SimplifiedRichTextEditor = ({ value, onChange, placeholder }: SimplifiedRichTextEditorProps) => {
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': fontSizes.map(size => size.value) }],
        [{ 'font': fontFamilies.map(font => font.value) }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        font: function(value: string) {
          if (value) {
            this.quill.format('font', value);
          } else {
            this.quill.format('font', false);
          }
        },
        size: function(value: string) {
          if (value) {
            this.quill.format('size', value);
          } else {
            this.quill.format('size', false);
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'align',
    'blockquote', 'code-block', 'link', 'image'
  ];

  const insertTemplate = (templateKey: keyof typeof sectionTemplates) => {
    const template = sectionTemplates[templateKey];
    onChange(value + '\n\n' + template);
  };

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
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">Insert Section Templates:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertTemplate('introduction')}
              >
                <Plus className="mr-1 h-3 w-3" />
                Introduction
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertTemplate('keyFindings')}
              >
                <Plus className="mr-1 h-3 w-3" />
                Key Findings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertTemplate('analysis')}
              >
                <Plus className="mr-1 h-3 w-3" />
                Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertTemplate('recommendations')}
              >
                <Plus className="mr-1 h-3 w-3" />
                Recommendations
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => insertTemplate('conclusion')}
              >
                <Plus className="mr-1 h-3 w-3" />
                Conclusion
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Insert Media & Elements:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChartBuilder(true)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Chart
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMediaGallery(true)}
              >
                <Image className="mr-2 h-4 w-4" />
                Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={insertTable}
              >
                <Table className="mr-2 h-4 w-4" />
                Table
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={insertCallout}
              >
                <Quote className="mr-2 h-4 w-4" />
                Callout
              </Button>
            </div>
          </div>
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

export default SimplifiedRichTextEditor;
