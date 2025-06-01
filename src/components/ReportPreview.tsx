
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportPreviewProps {
  post: {
    title: string;
    excerpt: string;
    content: string;
    author: string;
    authorRole: string;
    category: string;
    tags: string[];
    readTime: string;
    image: string;
  };
  onClose: () => void;
  onPublish: () => void;
}

export const ReportPreview = ({ post, onClose, onPublish }: ReportPreviewProps) => {
  const renderChart = (chartElement: HTMLElement) => {
    const chartData = JSON.parse(chartElement.getAttribute('data-chart') || '{}');
    const colors = ['#22aee1', '#20466d', '#79858D', '#f59e0b', '#ef4444', '#10b981'];

    switch (chartData.type) {
      case 'bar':
        return (
          <div className="my-6">
            {chartData.title && <h3 className="text-lg font-semibold text-center mb-4">{chartData.title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: chartData.xAxisLabel, position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#22aee1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="my-6">
            {chartData.title && <h3 className="text-lg font-semibold text-center mb-4">{chartData.title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: chartData.xAxisLabel, position: 'insideBottom', offset: -10 }} />
                <YAxis label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22aee1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        return (
          <div className="my-6">
            {chartData.title && <h3 className="text-lg font-semibold text-center mb-4">{chartData.title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  const processContent = (content: string) => {
    // Convert chart placeholders to actual charts
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const chartElements = doc.querySelectorAll('.chart-placeholder');
    
    let processedContent = content;
    chartElements.forEach((element) => {
      const chartId = element.getAttribute('data-chart-id');
      processedContent = processedContent.replace(
        element.outerHTML,
        `<div id="chart-${chartId}" class="chart-container"></div>`
      );
    });
    
    return processedContent;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Report Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            
            {/* Featured Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Featured image"
                className="w-full max-h-64 object-cover rounded-lg mb-6"
              />
            )}
          </div>

          {/* Meta Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                    {post.authorRole && <span className="text-gray-400">• {post.authorRole}</span>}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button onClick={onPublish} className="bg-[#22aee1] hover:bg-[#20466d]">
            Publish Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
