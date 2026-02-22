"use client"

import { Package, AlertTriangle, Tag, ArrowDownUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts, useCategories, useMovements, useDashboardInfo } from "@/hooks/use-inventory"
import { getCategoryName } from "@/lib/inventory-store"
import { LottieIcon } from "./icons/lottie-icon"
import { log } from "console"

export function DashboardContent() {
  const products = useProducts()
  const categories = useCategories()
  const movements = useMovements()
  const {data}  = useDashboardInfo()

  console.log("Data:",data);
  
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockProducts = products.filter((p) => p.quantity <= p.minStock && p.quantity > 0)
  const outOfStockProducts = products.filter((p) => p.quantity === 0)



  const stats = [
    {
      label: "Total Productos",
      value: data?.totalProducto,
      icon: "/MagicBox.json",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Stock Total",
      value: data?.totalStock.toLocaleString(),
      icon: "/Refund.json",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Stock Bajo",
      value: data?.stockBajos,
      icon: "/ArrowBottom.json",
      color: "text-[hsl(11, 92%, 50%)]",
      bgColor: "bg-[hsl(11,92%,50%)]/10",
    },
    {
      label: "Categorias",
      value: data?.totalCategorias,
      icon: "/bookmark.json",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ]

  const recentMovements = movements.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen general del inventario
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor}`}>
                <LottieIcon src={stat.icon} className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Movimientos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay movimientos registrados.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {recentMovements.map((mov) => (
                  <li key={mov.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground truncate">{mov.productName}</p>
                      <p className="text-xs text-muted-foreground">{mov.note}</p>
                    </div>
                    <Badge
                      className={
                        mov.type === "entrada"
                          ? "bg-accent/15 text-accent border-accent/30 hover:bg-accent/15"
                          : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15"
                      }
                      variant="outline"
                    >
                      {mov.type === "entrada" ? "+" : "-"}{mov.quantity}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Alertas de Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todo el inventario esta en orden.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {outOfStockProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{getCategoryName(p.categoryId)}</p>
                    </div>
                    <Badge variant="destructive">Agotado</Badge>
                  </li>
                ))}
                {lowStockProducts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.quantity} / {p.minStock} min
                      </p>
                    </div>
                    <Badge className="bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,40%)] border-[hsl(38,92%,50%)]/30 hover:bg-[hsl(38,92%,50%)]/15" variant="outline">
                      Bajo
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
