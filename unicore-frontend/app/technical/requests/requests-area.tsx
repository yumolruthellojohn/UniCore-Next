"use client"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
export const description = "Area Chart not working at the moment"
const chartData = [
  { month: "May", requests: 0 },
  { month: "June", requests: 0 },
  { month: "July", requests: 0 },
  { month: "August", requests: 0 },
  { month: "September", requests: 2 },
  { month: "October", requests: 10 },
]
const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig
export function RequestsArea() {
  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle>Requests Submission Activity</CardTitle>
        <CardDescription>
          Development in Progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="requests"
              type="natural"
              fill="var(--color-requests)"
              fillOpacity={0.4}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Development in Progress
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Chart is not working at the moment
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}