
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartBuilderProps {
  onInsert: (chartData: any) => void;
  onClose: () => void;
}

export const ChartBuilder = ({ onInsert, onClose }: ChartBuilderProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [title, setTitle] = useState('');
  const [dataInput, setDataInput] = useState('Label 1, 100\nLabel 2, 150\nLabel 3, 120');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');

  const parseData = (input: string) => {
    return input.split('\n').map(line => {
      const [name, value] = line.split(',').map(s => s.trim());
      return { name, value: parseInt(value) || 0 };
    }).filter(item => item.name && item.value);
  };

  const chartData = parseData(dataInput);
  const colors = ['#22aee1', '#20466d', '#79858D', '#f59e0b', '#ef4444', '#10b981'];

  const renderPreview = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#22aee1" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22aee1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const handleInsert = () => {
    const chartConfig = {
      type: chartType,
      title,
      data: chartData,
      xAxisLabel,
      yAxisLabel,
      colors
    };
    onInsert(chartConfig);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chart Builder</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>

            <div>
              <Label>Chart Type</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  onClick={() => setChartType('bar')}
                  size="sm"
                >
                  Bar Chart
                </Button>
                <Button
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  onClick={() => setChartType('line')}
                  size="sm"
                >
                  Line Chart
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  onClick={() => setChartType('pie')}
                  size="sm"
                >
                  Pie Chart
                </Button>
              </div>
            </div>

            {chartType !== 'pie' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="x-axis">X-Axis Label</Label>
                  <Input
                    id="x-axis"
                    value={xAxisLabel}
                    onChange={(e) => setXAxisLabel(e.target.value)}
                    placeholder="X-axis label"
                  />
                </div>
                <div>
                  <Label htmlFor="y-axis">Y-Axis Label</Label>
                  <Input
                    id="y-axis"
                    value={yAxisLabel}
                    onChange={(e) => setYAxisLabel(e.target.value)}
                    placeholder="Y-axis label"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="chart-data">Data (Label, Value per line)</Label>
              <Textarea
                id="chart-data"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="Label 1, 100&#10;Label 2, 150&#10;Label 3, 120"
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter data as: Label, Value (one per line)
              </p>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {title && <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>}
                {renderPreview()}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!title || chartData.length === 0}>
            Insert Chart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
