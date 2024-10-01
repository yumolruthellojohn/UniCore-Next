"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Component as InventoryDonut } from "../inventory/inventory-donut"
import { Component as RequestsDonut } from "../requests/requests-donut"

interface InventoryData {
  item_category: string;
  total_quantity: number;
  total_cost: number;
}

interface RequestsData {
  rq_type: string;
  ongoing_count: number;
  completed_count: number;
}

// Function to generate alternating colors
function getAlternatingColor(index: number): string {
    const hues = [0, 120, 240] // Red, Green, Blue
    const hue = hues[index % 3]
    const lightness = 50 + (index % 2) * 10 // Alternates between 50% and 60% lightness
    return `hsl(${hue}, 70%, ${lightness}%)`
}

export default function Dashboard() {
    const [inventoryData, setInventoryData] = useState<InventoryData[]>([])
    const [requestsData, setRequestsData] = useState<RequestsData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [inventoryResponse, requestsResponse] = await Promise.all([
                    axios.get("http://localhost:8081/items_summary"),
                    axios.get("http://localhost:8081/requests_summary")
                ]);
                console.log("Fetched inventory data:", inventoryResponse.data);
                console.log("Fetched requests data:", requestsResponse.data);
                setInventoryData(inventoryResponse.data);
                setRequestsData(requestsResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to fetch data');
                setIsLoading(false);
            }
        }

        fetchData()
    }, [])

    const quantityData = inventoryData.map((item, index) => ({
        browser: item.item_category,
        visitors: item.total_quantity,
        fill: getAlternatingColor(index)
    }))

    const costData = inventoryData.map((item, index) => ({
        browser: item.item_category,
        visitors: item.total_cost,
        fill: getAlternatingColor(index)
    }))

    const ongoingRequestsData = requestsData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.ongoing_count,
        fill: getAlternatingColor(index)
    }))

    const completedRequestsData = requestsData.map((item, index) => ({
        browser: item.rq_type,
        visitors: item.completed_count,
        fill: getAlternatingColor(index)
    }))

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-2">Requests Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4 mb-8">
                <RequestsDonut 
                    title="Ongoing Requests by Type"
                    description="Current Ongoing Requests"
                    data={ongoingRequestsData}
                />
                <RequestsDonut 
                    title="Completed Requests by Type"
                    description="Total Completed Requests"
                    data={completedRequestsData}
                />
            </div>
            <h2 className="text-2xl font-bold mb-2">Inventory Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-4">
                <InventoryDonut 
                    title="Total Quantity by Category"
                    description="Current Inventory Count"
                    data={quantityData}
                />
                <InventoryDonut 
                    title="Total Cost by Category"
                    description="Current Inventory Value"
                    data={costData}
                />
            </div>
        </div>
    )
}