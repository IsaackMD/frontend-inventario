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
import { Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/inventory-store"

interface StockAdjustDialogProps {
  product: Product | null
  type: "entrada" | "salida"
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdjust: (productId: string, quantity: number, type: "entrada" | "salida") => Promise<void>
  isLoading: boolean
}

export function StockAdjustDialog({
  product,
  type,
  open,
  onOpenChange,
  onAdjust,
  isLoading,
}: StockAdjustDialogProps) {
  const [quantity, setQuantity] = useState("")

  const handleSubmit = async () => {
    if (!product || !quantity || Number(quantity) <= 0) return

    const qty = Number(quantity)

    // Validar que no se retire más de lo disponible
    if (type === "salida" && qty > product.stock) {
      toast.error(`No puedes retirar más de ${product.stock} unidades`)
      return
    }

    try {
      await onAdjust(product.id, qty, type)
      setQuantity("")
      onOpenChange(false)
    } catch (error) {
      // El error ya se maneja en el padre
    }
  }

  const maxQuantity = type === "salida" ? product?.stock ?? 0 : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "entrada" ? (
              <div className="flex items-center gap-2 text-accent">
                <Plus className="h-5 w-5" />
                <span>Agregar Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <Minus className="h-5 w-5" />
                <span>Retirar Stock</span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {product?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Stock actual */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Stock actual:</span>
            <span className="text-lg font-semibold text-card-foreground">
              {product?.stock ?? 0} unidades
            </span>
          </div>

          {/* Input de cantidad */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Cantidad a {type === "entrada" ? "agregar" : "retirar"}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
            />
            {type === "salida" && maxQuantity !== undefined && (
              <p className="text-xs text-muted-foreground">
                Máximo disponible: {maxQuantity} unidades
              </p>
            )}
          </div>

          {/* Preview del nuevo stock */}
          {quantity && Number(quantity) > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed">
              <span className="text-sm text-muted-foreground">Nuevo stock:</span>
              <span className="text-lg font-semibold text-card-foreground">
                {type === "entrada"
                  ? (product?.stock ?? 0) + Number(quantity)
                  : (product?.stock ?? 0) - Number(quantity)}{" "}
                unidades
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setQuantity("")
              onOpenChange(false)
            }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!quantity || Number(quantity) <= 0 || isLoading}
            className={
              type === "entrada"
                ? "bg-accent hover:bg-accent/90"
                : "bg-destructive hover:bg-destructive/90"
            }
          >
            {isLoading ? (
              "Procesando..."
            ) : (
              <>
                {type === "entrada" ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </>
                ) : (
                  <>
                    <Minus className="h-4 w-4 mr-2" />
                    Retirar
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}