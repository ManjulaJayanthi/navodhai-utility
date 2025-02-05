"use client";

import { useState } from "react";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import { ChartVisualization } from "@/components/chart-visualization";
import { ProductData, parseExcelFile } from "@/lib/excel-parser";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
] as const;

// const numericFields = ["price", "sell"];

const dataFields: Array<{
  value: keyof ProductData;
  label: string;
  type: "numeric" | "categorical";
}> = [
  { value: "order", label: "Order", type: "categorical" },
  { value: "style", label: "Style", type: "categorical" },
  { value: "fit", label: "Fit", type: "categorical" },
  { value: "type", label: "Type", type: "categorical" },
  { value: "pantType", label: "Pant Type", type: "categorical" },
  { value: "material", label: "Material", type: "categorical" },
  {
    value: "materialComposition",
    label: "Material Composition",
    type: "categorical",
  },
  { value: "price", label: "Price", type: "numeric" },
  { value: "sell", label: "Sell", type: "numeric" },
  { value: "color", label: "Color", type: "categorical" },
];

export default function Home() {
  const [data, setData] = useState<ProductData[]>([]);
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [xAxis, setXAxis] = useState<keyof ProductData>("style");
  const [yAxis, setYAxis] = useState<keyof ProductData>("price");
  const [showChart, setShowChart] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      console.log("Starting file upload...");
      const parsedData = await parseExcelFile(file);
      console.log("Parsed data:", parsedData);
      setData(parsedData);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing file. Please make sure it's a valid Excel file.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Amazon Product Statistics Viewer</h1>

      {data.length === 0 ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <div className="space-y-6">
          <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select
                value={chartType}
                onValueChange={(value: typeof chartType) => setChartType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">X Axis</label>
              <Select
                value={xAxis}
                onValueChange={(value: keyof ProductData) => setXAxis(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select X axis" />
                </SelectTrigger>
                <SelectContent>
                  {dataFields
                    .filter((field) =>
                      chartType === "pie" ? field.type === "categorical" : true
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
                    .filter((field) => field.type === "numeric")
                    .map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="space-y-6">
            <button
              onClick={() => {
                console.log("Generate Chart clicked");
                console.log("Current state:", {
                  data: data.length,
                  chartType,
                  xAxis,
                  yAxis,
                });
                setShowChart(true);
              }}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Generate Chart
            </button>

            {showChart && (
              <div className="min-h-[500px] w-full bg-white rounded-lg shadow-lg">
                <ChartVisualization
                  data={data}
                  chartType={chartType}
                  xAxis={xAxis}
                  yAxis={yAxis}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
