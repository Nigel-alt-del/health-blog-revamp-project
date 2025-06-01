
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Section {
  id: string;
  title: string;
  content: string;
  type: 'introduction' | 'key-findings' | 'analysis' | 'conclusion' | 'custom';
  collapsed: boolean;
}

interface SectionManagerProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  onSectionContentChange: (sectionId: string, content: string) => void;
}

const sectionTemplates = {
  introduction: {
    title: 'Introduction',
    content: '<h2>Introduction</h2><p>Provide an overview of the report topic and objectives...</p>'
  },
  'key-findings': {
    title: 'Key Findings',
    content: '<h2>Key Findings</h2><ul><li>Finding 1: Description</li><li>Finding 2: Description</li></ul>'
  },
  analysis: {
    title: 'Analysis',
    content: '<h2>Analysis</h2><p>Detailed analysis of the data and findings...</p>'
  },
  conclusion: {
    title: 'Conclusion',
    content: '<h2>Conclusion</h2><p>Summary of findings and recommendations...</p>'
  }
};

export const SectionManager = ({ sections, onSectionsChange, onSectionContentChange }: SectionManagerProps) => {
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const addSection = (type: keyof typeof sectionTemplates | 'custom') => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: type === 'custom' ? newSectionTitle : sectionTemplates[type].title,
      content: type === 'custom' ? '<p>Enter your content here...</p>' : sectionTemplates[type].content,
      type,
      collapsed: false
    };
    
    onSectionsChange([...sections, newSection]);
    if (type === 'custom') {
      setNewSectionTitle('');
    }
  };

  const removeSection = (sectionId: string) => {
    onSectionsChange(sections.filter(section => section.id !== sectionId));
  };

  const toggleSection = (sectionId: string) => {
    onSectionsChange(
      sections.map(section =>
        section.id === sectionId
          ? { ...section, collapsed: !section.collapsed }
          : section
      )
    );
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    onSectionsChange(
      sections.map(section =>
        section.id === sectionId
          ? { ...section, title }
          : section
      )
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedSections = Array.from(sections);
    const [removed] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, removed);

    onSectionsChange(reorderedSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Manager</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('introduction')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Introduction
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('key-findings')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Key Findings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('analysis')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSection('conclusion')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Conclusion
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Custom section title"
            className="flex-1"
          />
          <Button
            onClick={() => addSection('custom')}
            disabled={!newSectionTitle.trim()}
            size="sm"
          >
            Add Custom
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border rounded-lg p-3 bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSection(section.id)}
                            >
                              {section.collapsed ? (
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Input
                              value={section.title}
                              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                              className="flex-1 font-medium"
                            />
                            <Badge variant="secondary">{section.type}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        {!section.collapsed && (
                          <div className="mt-3 text-sm text-gray-600">
                            Content preview: {section.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};
