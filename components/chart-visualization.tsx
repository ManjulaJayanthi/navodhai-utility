import { Card } from "@/components/ui/card";
import { ProductData } from "@/lib/excel-parser";
import {
  BarChart,
  LineChart,
  DonutChart,
  Title,
  Text,
  Grid,
} from "@tremor/react";
import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChartVisualizationProps {
  data: ProductData[];
  chartType: "bar" | "line" | "pie";
  xAxis: keyof ProductData;
  yAxis: keyof ProductData;
}

export function ChartVisualization({
  data,
  chartType,
  xAxis,
  yAxis,
}: ChartVisualizationProps) {
  const [error, setError] = useState<string | null>(null);

  const chartData = useMemo(() => {
    try {
      if (!data || data.length === 0) {
        setError("No data available to display");
        return [];
      }
      
      // Clear any previous errors if we have data
      setError(null);

      if (chartType === "pie") {
        // For pie charts, aggregate the data and handle invalid numbers
        const aggregated = data.reduce((acc, item) => {
          const key = String(item[xAxis]).trim() || "Unknown";
          const value = Number(item[yAxis]);
          if (!isNaN(value)) {
            acc[key] = (acc[key] || 0) + value;
          }
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(aggregated)
          .filter(([, value]) => value > 0)
          .map(([name, value]) => ({
            name,
            value,
          }));

        if (chartData.length === 0) {
          setError("No valid data points to display");
          return [];
        }

        return chartData;
      }

      // For bar and line charts
      const chartData = data
        .map((item) => {
          const yValue = Number(item[yAxis]);
          const xValue = String(item[xAxis]);
          return {
            [xAxis]: xValue.trim() || "Unknown",
            [yAxis]: isNaN(yValue) ? 0 : yValue,
          } as Record<string, string | number>;
        })
        .filter((item) => Number(item[yAxis]) > 0);

      if (chartData.length === 0) {
        setError("No valid data points to display");
        return [];
      }

      return chartData;
    } catch {
      setError("Error processing data");
      return [];
    }
  }, [data, chartType, xAxis, yAxis]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const values = chartData.map((item) => {
      if (chartType === "pie") {
        return (item as { value: number }).value;
      }
      return Number((item as Record<string, string | number>)[yAxis] || 0);
    });

    return {
      total: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }, [chartData, chartType, yAxis]);

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
          <Grid numItems={2} numItemsSm={4} className="gap-4">
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
          </Grid>
        )}
        <div className="w-full h-[400px] mt-4">
          {chartType === "bar" && chartData.length > 0 && (
            <BarChart
              data={chartData}
              index={xAxis as string}
              categories={[yAxis as string]}
              colors={["blue"]}
              yAxisWidth={64}
              showAnimation={true}
              className="h-full"
              showLegend={true}
              valueFormatter={(value) => value.toLocaleString()}
            />
          )}

          {chartType === "line" && chartData.length > 0 && (
            <LineChart
              data={chartData}
              index={xAxis as string}
              categories={[yAxis as string]}
              colors={["blue"]}
              yAxisWidth={64}
              showAnimation={true}
              className="h-full"
              showLegend={true}
              valueFormatter={(value) => value.toLocaleString()}
              curveType="monotone"
            />
          )}

          {chartType === "pie" && chartData.length > 0 && (
            <DonutChart
              data={chartData}
              category="value"
              index="name"
              colors={[
                "blue",
                "cyan",
                "indigo",
                "violet",
                "rose",
                "amber",
                "emerald",
                "orange",
              ]}
              showAnimation={true}
              className="h-full"
              valueFormatter={(value) => value.toLocaleString()}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
