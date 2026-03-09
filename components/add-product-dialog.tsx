"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useCreateProduct } from "@/hooks/UseFetch"

interface Category {
  id: string
  name: string
}

interface AddProductDialogProps {
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductDialog({ categories, open, onOpenChange }: AddProductDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [stock, setStock] = useState("")
  const [stockmin, setStockmin] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createProduct = useCreateProduct()

  const handleSubmit = async () => {
    if (!name || !categoryId) return

    setIsLoading(true)

    try {
      const response = await createProduct.mutateAsync({
        name,
        description,
        stock: Number(stock) || 0,
        stockmin: Number(stockmin) || 0,
        CategoryId: categoryId,
      });

      if (!response.isSuccess) {
        throw new Error("Error al crear el producto")
      }

      // Limpiar el formulario
      setName("")
      setDescription("")
      setStock("")
      setStockmin("")
      setCategoryId("")
      onOpenChange(false)

      // Aquí puedes agregar un toast o notificación de éxito
      console.log("✅ Producto creado exitosamente")

      // Opcional: Recargar la lista de productos
      window.location.reload() // O mejor, usa un callback para actualizar el estado del padre
    } catch (error) {
      console.error("❌ Error:", error)
      // Aquí puedes mostrar un toast de error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Agregar Producto</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo producto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {/* Nombre */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="prod-name">Nombre del producto *</Label>
            <Input
              id="prod-name"
              placeholder="Ej: Monitor Samsung 27"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="prod-description">Descripción</Label>
            <Textarea
              id="prod-description"
              placeholder="Descripción del producto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="prod-category">Categoría *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="prod-category">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-stock">Stock inicial</Label>
            <Input
              id="prod-stock"
              type="number"
              min="0"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* Stock Mínimo */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-stockmin">Stock mínimo</Label>
            <Input
              id="prod-stockmin"
              type="number"
              min="0"
              placeholder="0"
              value={stockmin}
              onChange={(e) => setStockmin(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!name || !categoryId || isLoading}
          >
            {isLoading ? "Guardando..." : "Agregar Producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}