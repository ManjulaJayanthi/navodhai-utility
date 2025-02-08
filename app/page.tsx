'use client';

import { useMemo, useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { ChartVisualization } from '@/components/chart-visualization';
import { ProductData, parseExcelFile } from '@/lib/excel-parser';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/date-range-picker';

// const chartTypes = [
//   { value: 'bar', label: 'Bar Chart' },
//   { value: 'line', label: 'Line Chart' },
//   { value: 'pie', label: 'Pie Chart' },
// ] as const;

// const numericFields = ["price", "sell"];

const dataFields: Array<{
  value: keyof ProductData;
  label: string;
  type: 'numeric' | 'categorical' | 'temporal';
}> = [
  { value: 'date', label: 'Date', type: 'temporal' },
  { value: 'id', label: 'ID', type: 'categorical' },
  { value: 'order', label: 'Order', type: 'categorical' },
  { value: 'style', label: 'Style', type: 'categorical' },
  { value: 'fit', label: 'Fit', type: 'categorical' },
  { value: 'type', label: 'Type', type: 'categorical' },
  { value: 'pantType', label: 'Pant Type', type: 'categorical' },
  { value: 'material', label: 'Material', type: 'categorical' },
  {
    value: 'materialComposition',
    label: 'Material Composition',
    type: 'categorical',
  },
  { value: 'price', label: 'Price', type: 'numeric' },
  { value: 'sell', label: 'Sell', type: 'numeric' },
  { value: 'color', label: 'Color', type: 'categorical' },
  { value: 'seller', label: 'Seller', type: 'categorical' },
  { value: 'size', label: 'Size', type: 'categorical' },
];

export default function Home() {
  const [data, setData] = useState<ProductData[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>();
  const [xAxis] = useState<keyof ProductData>('id');
  const [yAxis, setYAxis] = useState<keyof ProductData>('price');
  const [showChart, setShowChart] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleFileUpload = async (file: File) => {
    try {
      console.log('Starting file upload...');
      const parsedData = await parseExcelFile(file);
      console.log('Parsed data:', parsedData);
      setData(parsedData);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert("Error parsing file. Please make sure it's a valid Excel file.");
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (dateRange?.from) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(dateRange.from as Date);
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        return toDate
          ? itemDate >= fromDate && itemDate <= toDate
          : itemDate >= fromDate;
      });
    }

    // Sort data based on Y axis if it's numeric or size
    if (yAxis === 'price' || yAxis === 'sell' || yAxis === 'size') {
      filtered.sort((a, b) => {
        const aValue = yAxis === 'size' ? a[yAxis] : Number(a[yAxis]);
        const bValue = yAxis === 'size' ? b[yAxis] : Number(b[yAxis]);
        return sortOrder === 'asc'
          ? aValue > bValue
            ? 1
            : -1
          : bValue > aValue
          ? 1
          : -1;
      });
    }

    return filtered;
  }, [data, dateRange, yAxis, sortOrder]);

  const formattedData = useMemo(() => {
    return filteredData.map((item) => ({
      ...item,
      id: `${item.style}_${item.id}`, // Format ID as Style_ID
    }));
  }, [filteredData]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Amazon Product Statistics Viewer</h1>

      {data.length === 0 ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <div className="space-y-6">
          <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={(range) =>
                  setDateRange(
                    range
                      ? { from: range.from, to: range.to ?? undefined }
                      : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Y Axis</label>
              <Select
                value={yAxis}
                onValueChange={(value: keyof ProductData) => setYAxis(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Y axis" />
                </SelectTrigger>
                <SelectContent>
                  {dataFields
                    .filter((field) =>
                      ['numeric', 'categorical'].includes(field.type)
                    )
                    .map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={sortOrder}
                onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="space-y-6">
            <button
              onClick={() => {
                console.log('Generate Chart clicked');
                setShowChart(true);
              }}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Generate Chart
            </button>

            {showChart && (
              <div className="min-h-[500px] w-full bg-white rounded-lg shadow-lg">
                <ChartVisualization
                  data={formattedData}
                  chartType="line"
                  xAxis={xAxis}
                  yAxis={yAxis}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
