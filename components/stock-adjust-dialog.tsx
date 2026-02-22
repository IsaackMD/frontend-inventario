"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
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
import type { Product } from "@/lib/inventory-store"
import { adjustStock } from "@/lib/inventory-store"

interface StockAdjustDialogProps {
  product: Product | null
  type: "entrada" | "salida"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StockAdjustDialog({
  product,
  type,
  open,
  onOpenChange,
}: StockAdjustDialogProps) {
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    if (!product || !quantity || Number(quantity) <= 0) return

    adjustStock(product.id, Number(quantity), type, note || (type === "entrada" ? "Entrada de stock" : "Salida de stock"))
    setQuantity("")
    setNote("")
    onOpenChange(false)
  }

  const isEntrada = type === "entrada"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            {isEntrada ? (
              <Plus className="h-5 w-5 text-accent" />
            ) : (
              <Minus className="h-5 w-5 text-destructive" />
            )}
            {isEntrada ? "Agregar Stock" : "Retirar Stock"}
          </DialogTitle>
          <DialogDescription>
            {product?.name} - Stock actual: {product?.quantity} unidades
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={!isEntrada ? product?.quantity : undefined}
              placeholder="Ingresa la cantidad"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note">Nota (opcional)</Label>
            <Input
              id="note"
              placeholder="Razon del movimiento"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!quantity || Number(quantity) <= 0}
            className={
              isEntrada
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            }
          >
            {isEntrada ? "Agregar" : "Retirar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
