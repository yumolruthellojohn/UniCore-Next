import { columns, Item } from "./inventory-columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableAdd } from "@/components/data-table/data-table-add-button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

async function getData(): Promise<Item[]> {
    let item = null;
    try {
        const response = await axios.get("http://localhost:8081/items");
        item = response.data;
      } catch (err) {
        console.log(err);
        item = null;
      }
    
    return item;
}

const filterColumn = {
    id: "item_name_desc",
    title: "Name/Description",
}

export default async function Inventory() {
    const data = await getData()

    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-4">
            <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Inventory</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Manage your items and view their details.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <DataTableAdd text="Add New Item" href="/admin/inventory/add" />
                </CardFooter>
              </Card>
            </div>
            <DataTable 
                columns={columns} 
                data={data} 
                filterColumn={filterColumn}
            />
        </div>
    )
}