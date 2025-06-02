
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
    onChange(value + '\n\n' + template);
  };

  const insertChart = (chartData: any) => {
    const chartHtml = createChartHtml(chartData);
    onChange(value + chartHtml);
    setShowChartBuilder(false);
  };

  const insertImage = (imageUrl: string, caption?: string) => {
    const imageHtml = createImageHtml(imageUrl, caption);
    onChange(value + imageHtml);
    setShowMediaGallery(false);
  };

  const insertTable = () => {
    const tableHtml = insertTableHtml();
    onChange(value + tableHtml);
  };

  const insertCallout = () => {
    const calloutHtml = insertCalloutHtml();
    onChange(value + calloutHtml);
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
          value={value}
          onChange={onChange}
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
