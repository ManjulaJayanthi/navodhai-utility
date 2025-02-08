'use client';

import { Card } from '@/components/ui/card';
import { ProductData } from '@/lib/excel-parser';
import { LineChart, Title, Text, Grid } from '@tremor/react';
import { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChartVisualizationProps {
  data: ProductData[];
  chartType: 'line';
  xAxis: keyof ProductData;
  yAxis: keyof ProductData;
}

export function ChartVisualization({
  data,
  xAxis,
  yAxis,
}: ChartVisualizationProps) {
  const [error, setError] = useState<string | null>(null);

  const chartData = useMemo(() => {
    try {
      if (!data || data.length === 0) {
        setError('No data available to display');
        return [];
      }

      setError(null);

      // For line chart
      const chartData = data
        .map((item) => {
          const yValue = Number(item[yAxis]);
          const xValue = String(item[xAxis]);

          return {
            [xAxis]: xValue.trim() || 'Unknown',
            [yAxis]: isNaN(yValue) ? 0 : yValue,
            link: item.link, // Add link to chart data
          } as Record<string, string | number>;
        })
        .filter((item) => Number(item[yAxis]) > 0);

      if (chartData.length === 0) {
        setError('No valid data points to display');
        return [];
      }

      return chartData;
    } catch {
      setError('Error processing data');
      return [];
    }
  }, [data, xAxis, yAxis]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map((item) => Number(item[yAxis] || 0));

    return {
      total: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      count: values.length,
    };
  }, [chartData, yAxis]);

  return (
    <Card className="w-full p-6 mx-auto bg-white shadow-lg rounded-lg border-t-4 border-t-blue-500">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Title className="text-2xl font-bold text-gray-800">
            Product Statistics
          </Title>
          <Text className="text-gray-600 font-medium">{`${xAxis} vs ${yAxis}`}</Text>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {stats && (
          <Grid numItems={2} numItemsSm={5} className="gap-4">
            <Card className="p-4">
              <Text className="text-sm">Total</Text>
              <Title className="text-2xl">{stats.total.toLocaleString()}</Title>
            </Card>
            <Card className="p-4">
              <Text className="text-sm">Average</Text>
              <Title className="text-2xl">
                {stats.avg.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </Title>
            </Card>
            <Card className="p-4">
              <Text className="text-sm">Maximum</Text>
              <Title className="text-2xl">{stats.max.toLocaleString()}</Title>
            </Card>
            <Card className="p-4">
              <Text className="text-sm">Minimum</Text>
              <Title className="text-2xl">{stats.min.toLocaleString()}</Title>
            </Card>
            <Card className="p-4">
              <Text className="text-sm">Count</Text>
              <Title className="text-2xl">{stats.count.toLocaleString()}</Title>
            </Card>
          </Grid>
        )}

        <div className="w-full h-[400px] mt-4">
          {chartData.length > 0 && (
            <LineChart
              data={chartData}
              index={xAxis as string}
              categories={[yAxis as string]}
              colors={['blue']}
              yAxisWidth={64}
              showAnimation={true}
              className="h-full"
              showLegend={true}
              valueFormatter={(value) => value.toLocaleString()}
              curveType="monotone"
              onValueChange={(v) => {
                if (v?.link) {
                  window.open(v.link as string, '_blank');
                }
              }}
              showTooltip={true}
              customTooltip={({ payload }) => {
                if (!payload?.[0]?.payload) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 min-w-[250px]">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                          {xAxis}
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {data[xAxis]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                          {yAxis}
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          {Number(data[yAxis]).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {data.link && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <a
                          href={data.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          View Details →
                        </a>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
