"use client"

import * as React from "react"
import { Label,PieChart, Pie, } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface RequestsDonutProps {
  //title: string;
  //description: string;
  data: Array<{
    browser: string;  // This represents requests_types
    visitors: number; // This represents requests_count
    fill: string;
  }>;
}

export function Component({ data }: RequestsDonutProps) {
  console.log("RequestsDonut props:", { data })
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [data])

  const hasData = totalValue > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        {/*<CardTitle>{title}</CardTitle>*/}
        {/*<CardDescription>{description}</CardDescription>*/}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!hasData ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground text-lg">No Data</p>
          </div>
        ) : (
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel hideIndicator />}
                />
                <Pie
                data={data}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
                >
                <Label
                    content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                        <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                            >
                            {totalValue.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                            >
                            Total
                            </tspan>
                        </text>
                        )
                    }
                    }}
                />
                </Pie>
            </PieChart>
            </ChartContainer>
        )}
      </CardContent>
      {/* Color Legend */}
      <CardFooter className="grid grid-cols-2 gap-2">
        {data.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span>{entry.browser}</span>
            </div>
        ))}
      </CardFooter>
    </Card>
  )
}

// You might want to update this config to better reflect your categories
const chartConfig = {
  visitors: {
    label: "Value",
  },
  // Add more category configurations as needed
} satisfies ChartConfig
