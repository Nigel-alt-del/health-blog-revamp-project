
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartBuilder } from '../ChartBuilder';
import { MediaGallery } from '../MediaGallery';
import { SectionTemplateButtons } from './editor/SectionTemplateButtons';
import { MediaElementButtons } from './editor/MediaElementButtons';
import { sectionTemplates } from './editor/sectionTemplates';
import { createQuillModules, quillFormats } from './editor/editorConfig';
import { insertTableHtml, insertCalloutHtml, createChartHtml, createImageHtml } from './editor/editorUtils';

interface SimplifiedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SimplifiedRichTextEditor = ({ value, onChange, placeholder }: SimplifiedRichTextEditorProps) => {
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);

  const modules = createQuillModules();

  const insertTemplate = (templateKey: keyof typeof sectionTemplates) => {
    const template = sectionTemplates[templateKey];
    const currentValue = value || '';
    onChange(currentValue + '\n\n' + template);
  };

  const insertChart = (chartData: any) => {
    const chartHtml = createChartHtml(chartData);
    const currentValue = value || '';
    onChange(currentValue + chartHtml);
    setShowChartBuilder(false);
  };

  const insertImage = (imageUrl: string, caption?: string) => {
    const imageHtml = createImageHtml(imageUrl, caption);
    const currentValue = value || '';
    onChange(currentValue + imageHtml);
    setShowMediaGallery(false);
  };

  const insertTable = () => {
    const tableHtml = insertTableHtml();
    const currentValue = value || '';
    onChange(currentValue + tableHtml);
  };

  const insertCallout = () => {
    const calloutHtml = insertCalloutHtml();
    const currentValue = value || '';
    onChange(currentValue + calloutHtml);
  };

  const handleChange = (content: string) => {
    // Ensure we always pass a string to onChange
    onChange(content || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <div className="space-y-3">
          <SectionTemplateButtons onInsertTemplate={insertTemplate} />
          
          <MediaElementButtons
            onShowChartBuilder={() => setShowChartBuilder(true)}
            onShowMediaGallery={() => setShowMediaGallery(true)}
            onInsertTable={insertTable}
            onInsertCallout={insertCallout}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={handleChange}
          modules={modules}
          formats={quillFormats}
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
