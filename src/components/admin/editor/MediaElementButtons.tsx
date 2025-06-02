
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Image, Table, Quote } from 'lucide-react';

interface MediaElementButtonsProps {
  onShowChartBuilder: () => void;
  onShowMediaGallery: () => void;
  onInsertTable: () => void;
  onInsertCallout: () => void;
}

export const MediaElementButtons = ({
  onShowChartBuilder,
  onShowMediaGallery,
  onInsertTable,
  onInsertCallout
}: MediaElementButtonsProps) => {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">Insert Media & Elements:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowChartBuilder}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Chart
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShowMediaGallery}
        >
          <Image className="mr-2 h-4 w-4" />
          Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onInsertTable}
        >
          <Table className="mr-2 h-4 w-4" />
          Table
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onInsertCallout}
        >
          <Quote className="mr-2 h-4 w-4" />
          Callout
        </Button>
      </div>
    </div>
  );
};
