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
import { useMovements } from "@/hooks/use-inventory"

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
  const movements = useMovements()
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "entrada" | "salida">("all")

  const filtered = movements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.note.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === "all" || m.type === filterType
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
              onChange={(e) => setFilterType(e.target.value as "all" | "entrada" | "salida")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">Todos los movimientos</option>
              <option value="entrada">Solo entradas</option>
              <option value="salida">Solo salidas</option>
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
                  <TableHead>Nota</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron movimientos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {mov.type === "entrada" ? (
                            <ArrowUpCircle className="h-4 w-4 text-accent" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-destructive" />
                          )}
                          <Badge
                            variant="outline"
                            className={
                              mov.type === "entrada"
                                ? "bg-accent/15 text-accent border-accent/30"
                                : "bg-destructive/15 text-destructive border-destructive/30"
                            }
                          >
                            {mov.type === "entrada" ? "Entrada" : "Salida"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-card-foreground">{mov.productName}</TableCell>
                      <TableCell className="text-center font-semibold text-card-foreground">
                        {mov.type === "entrada" ? "+" : "-"}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">{mov.previousStock}</TableCell>
                      <TableCell className="text-center font-medium text-card-foreground">{mov.newStock}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{mov.note}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(mov.date)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {filtered.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                No se encontraron movimientos.
              </p>
            ) : (
              filtered.map((mov) => (
                <div
                  key={mov.id}
                  className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mov.type === "entrada" ? (
                        <ArrowUpCircle className="h-4 w-4 text-accent" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-destructive" />
                      )}
                      <Badge
                        variant="outline"
                        className={
                          mov.type === "entrada"
                            ? "bg-accent/15 text-accent border-accent/30"
                            : "bg-destructive/15 text-destructive border-destructive/30"
                        }
                      >
                        {mov.type === "entrada" ? "Entrada" : "Salida"}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-card-foreground">
                      {mov.type === "entrada" ? "+" : "-"}{mov.quantity}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-card-foreground">{mov.productName}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {mov.previousStock} &rarr; {mov.newStock}
                    </span>
                    <span>{formatDate(mov.date)}</span>
                  </div>
                  {mov.note && (
                    <p className="text-xs text-muted-foreground truncate">{mov.note}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
