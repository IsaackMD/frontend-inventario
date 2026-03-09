"use client"

import { useState } from "react"
import { ArrowUpCircle, ArrowDownCircle, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useHisorialStock } from "@/hooks/use-inventory"
import { StockMovement } from "@/lib/inventory-store"

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function HistoryContent() {
  const { data: movements } = useHisorialStock()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "In" | "Out">("all")

  const filtered = (movements ?? []).filter((m:StockMovement) => {
    const matchesSearch =
      m.producto.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === "all" || m.movementType === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Historial de Stock</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registro de todas las entradas y salidas del inventario
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por producto o nota..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "In" | "Out")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">Todos los movimientos</option>
              <option value="In">Solo entradas</option>
              <option value="Out">Solo salidas</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Stock Anterior</TableHead>
                  <TableHead className="text-center">Stock Nuevo</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron movimientos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered?.map((mov: StockMovement) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {mov.movementType === "In" ? (
                            <ArrowUpCircle className="h-4 w-4 text-accent" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-destructive" />
                          )}
                          <Badge
                            variant="outline"
                            className={
                              mov.movementType === "In"
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-destructive/15 text-destructive border-destructive/30"
                            }
                          >
                            {mov.movementType === "In" ? "Entrada" : "Salida"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-card-foreground">{mov.producto.name}</TableCell>
                      <TableCell className="text-center font-semibold text-card-foreground">
                        {mov.movementType === "In" ? "+" : "-"}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">{mov.oldStock}</TableCell>
                      <TableCell className="text-center font-medium text-card-foreground">{mov.movementType === "In" ? (mov.oldStock+mov.quantity) : (mov.oldStock-mov.quantity)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(mov.movementDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {filtered?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                No se encontraron movimientos.
              </p>
            ) : (
              filtered?.map((mov:StockMovement) => (
                <div
                  key={mov.id}
                  className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mov.movementType === "In" ? (
                        <ArrowUpCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-destructive" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          mov.movementType === "In"
                            ? "bg-accent/15 text-accent border-accent/30"
                            : "bg-destructive/15 text-destructive border-destructive/30"
                        }
                      >
                        {mov.movementType === "In" ? "Entrada" : "Salida"}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-card-foreground">
                      {mov.movementType === "In" ? "+" : "-"}{mov.quantity}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-card-foreground">{mov.producto.name}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {mov.oldStock} &rarr; {mov.movementType === "In" ? (mov.oldStock+mov.quantity) : (mov.oldStock-mov.quantity)}
                    </span>
                    <span>{formatDate(mov.movementDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
