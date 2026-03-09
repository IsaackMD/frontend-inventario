"use client"

import { useState } from "react"
import { Plus, Minus, Search, PackagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

import { useProducts, useCategories } from "@/hooks/use-inventory"
import type { Category, Product } from "@/lib/inventory-store"
import { StockAdjustDialog } from "@/components/stock-adjust-dialog"
import { AddProductDialog } from "@/components/add-product-dialog"
import { LottieIcon } from "./icons/lottie-icon"
import { useDecrement, useIncrement } from "@/hooks/UseFetch"

function getStockStatus(product: Product) {
  if (product.stock === 0) {
    return { label: "Agotado", variant: "destructive" as const, className: "" }
  }
  if (product.stock <= product.stockmin) {
    return {
      label: "Bajo",
      variant: "outline" as const,
      className: "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,40%)] border-[hsl(38,92%,50%)]/30",
    }
  }
  return {
    label: "Normal",
    variant: "outline" as const,
    className: "bg-accent/15 text-accent border-accent/30",
  }
}

export function ProductsContent() {
  const { data: products } = useProducts()
  const { data: categories } = useCategories()
  const incrementMutation = useIncrement()
  const decrementMutation = useDecrement()

  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustType, setAdjustType] = useState<"entrada" | "salida">("entrada")
  const [adjustOpen, setAdjustOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredProducts = (products ?? []).filter((p: Product) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      filterCategory === "all" || p.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  const openAdjust = (product: Product, type: "entrada" | "salida") => {
    setSelectedProduct(product)
    setAdjustType(type)
    setAdjustOpen(true)
  }

  const handleStockAdjust = async (
    productId: string,
    quantity: number,
    type: "entrada" | "salida"
  ) => {
    try {
      const body = {
        ProductId: productId,
        quantity: quantity,
      }

      if (type === "entrada") {
        await incrementMutation.mutateAsync(body)
        toast.success(`✅ Se agregaron ${quantity} unidades al stock`)
      } else {
        await decrementMutation.mutateAsync(body)
        toast.success(`✅ Se retiraron ${quantity} unidades del stock`)
      }
    } catch (error) {
      console.error("Error al ajustar stock:", error)
      toast.error("❌ Error al ajustar el stock")
      throw error
    }
  }

  const isAdjusting = incrementMutation.isPending || decrementMutation.isPending

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <LottieIcon src="/MagicBox.json" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-foreground text-balance">Productos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tu inventario de productos
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PackagePlus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o SKU..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="all">Todas las categorias</option>
              {categories?.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron productos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: Product) => {
                    const status = getStockStatus(product)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium text-card-foreground">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.categoryName}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-card-foreground">{product.stock}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            / {product.stockmin} min
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={status.variant} className={status.className}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-accent border-accent/30 hover:bg-accent/10 bg-transparent"
                              onClick={() => openAdjust(product, "entrada")}
                              disabled={isAdjusting}
                              aria-label={`Agregar stock a ${product.name}`}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                              onClick={() => openAdjust(product, "salida")}
                              disabled={product.stock === 0 || isAdjusting}
                              aria-label={`Retirar stock de ${product.name}`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {filteredProducts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">
                No se encontraron productos.
              </p>
            ) : (
              filteredProducts.map((product: Product) => {
                const status = getStockStatus(product)
                return (
                  <div
                    key={product.id}
                    className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                      </div>
                      <Badge variant={status.variant} className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Mínimo: {product.stockmin}
                      </span>
                      <span className="text-sm font-semibold text-card-foreground">
                        {product.stock}{" "}
                        <span className="text-xs font-normal text-muted-foreground">uds</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-accent border-accent/30 hover:bg-accent/10 bg-transparent"
                        onClick={() => openAdjust(product, "entrada")}
                        disabled={isAdjusting}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Agregar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
                        onClick={() => openAdjust(product, "salida")}
                        disabled={product.stock === 0 || isAdjusting}
                      >
                        <Minus className="h-3.5 w-3.5 mr-1" />
                        Retirar
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <StockAdjustDialog
        product={selectedProduct}
        type={adjustType}
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        onAdjust={handleStockAdjust}
        isLoading={isAdjusting}
      />
      <AddProductDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        categories={categories}
      />
    </div>
  )
}