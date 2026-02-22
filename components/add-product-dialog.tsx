"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addProduct } from "@/lib/inventory-store"
import { useCategories } from "@/hooks/use-inventory"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const categories = useCategories()
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [minStock, setMinStock] = useState("")
  const [price, setPrice] = useState("")

  const handleSubmit = () => {
    if (!name || !sku || !categoryId) return

    addProduct(
      name,
      sku,
      categoryId,
      Number(quantity) || 0,
      Number(minStock) || 0,
      Number(price) || 0
    )

    setName("")
    setSku("")
    setCategoryId("")
    setQuantity("")
    setMinStock("")
    setPrice("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Agregar Producto</DialogTitle>
          <DialogDescription>
            Completa la informacion del nuevo producto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="prod-name">Nombre del producto</Label>
            <Input
              id="prod-name"
              placeholder="Ej: Monitor Samsung 27"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-sku">SKU</Label>
            <Input
              id="prod-sku"
              placeholder="Ej: ELEC-004"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="prod-category">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-qty">Cantidad inicial</Label>
            <Input
              id="prod-qty"
              type="number"
              min="0"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-min">Stock minimo</Label>
            <Input
              id="prod-min"
              type="number"
              min="0"
              placeholder="0"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="prod-price">Precio unitario</Label>
            <Input
              id="prod-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !sku || !categoryId}>
            Agregar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
