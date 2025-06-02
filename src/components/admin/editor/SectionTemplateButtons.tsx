
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { sectionTemplates } from './sectionTemplates';

interface SectionTemplateButtonsProps {
  onInsertTemplate: (templateKey: keyof typeof sectionTemplates) => void;
}

export const SectionTemplateButtons = ({ onInsertTemplate }: SectionTemplateButtonsProps) => {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-2">Insert Section Templates:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsertTemplate('introduction')}
        >
          <Plus className="mr-1 h-3 w-3" />
          Introduction
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsertTemplate('keyFindings')}
        >
          <Plus className="mr-1 h-3 w-3" />
          Key Findings
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsertTemplate('analysis')}
        >
          <Plus className="mr-1 h-3 w-3" />
          Analysis
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsertTemplate('recommendations')}
        >
          <Plus className="mr-1 h-3 w-3" />
          Recommendations
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onInsertTemplate('conclusion')}
        >
          <Plus className="mr-1 h-3 w-3" />
          Conclusion
        </Button>
      </div>
    </div>
  );
};
