"use client"

import { useState } from "react"
import { Plus, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useCategories, useProducts } from "@/hooks/use-inventory"
import { Category, Product } from "@/lib/inventory-store"
import { AddCategory } from "./add-category"
import { useAddCategory } from "@/hooks/UseFetch"
import { toast } from "sonner"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function CategoriesContent() {
  const { data: categories } = useCategories()
  const { data: products } = useProducts()
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const createCategory = useAddCategory();

  const handleAdd = async () => {
    if (!name.trim()) return


    try {
      const body = {
        name: name.trim(),
        description: description.trim()
      }

      // ✅ Usa la mutación ya creada
      await createCategory.mutateAsync(body)

      // Limpiar formulario
      setName("")
      setDescription("")
      setAddOpen(false)

      toast.success("✅ Categoría creada exitosamente")
    } catch (error) {
      console.error("Error:", error)
      toast.error("❌ Error al crear la categoría")
    }
  }


const handleDelete = () => {
  if (!deleteTarget) return
  // deleteCategory(deleteTarget)
  setDeleteTarget(null)
}

const getProductCount = (categoryId: string) => {
  return (products ?? []).filter((p: Product) => p.categoryId === categoryId).length
}

const deleteTargetCategory = (categories ?? []).find((c: Category) => c.id === deleteTarget)
const deleteTargetProductCount = deleteTarget ? getProductCount(deleteTarget) : 0

return (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Categorias</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra las categorias de tus productos
        </p>
      </div>
      <Button onClick={() => setAddOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Nueva Categoria
      </Button>
    </div>

    <Card>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead className="text-center">Productos</TableHead>
                <TableHead>Fecha de Creacion</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay categorias registradas.
                  </TableCell>
                </TableRow>
              ) : (
                categories?.map((cat: Category) => {
                  const count = getProductCount(cat.id)
                  return (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                            <Tag className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-card-foreground">{cat.name}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell className="text-muted-foreground max-w-[300px] truncate">
                          {cat.description || "Sin descripcion"}
                        </TableCell> */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md bg-muted text-sm font-medium text-muted-foreground">
                          {count}
                        </span>
                      </TableCell>
                      {/* <TableCell className="text-muted-foreground text-sm">
                          {formatDate(cat.createdAt)}
                        </TableCell> */}
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(cat.id)}
                          aria-label={`Eliminar categoria ${cat.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          {categories?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              No hay categorias registradas.
            </p>
          ) : (
            categories?.map((cat: Category) => {
              const count = getProductCount(cat.id)
              return (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{cat.name}</p>
                    {/* <p className="text-xs text-muted-foreground truncate">
                        {cat.description || "Sin descripcion"}
                      </p> */}
                    <p className="text-xs text-muted-foreground mt-1">
                      {count} producto{count !== 1 ? "s" : ""} &middot;
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget(cat.id)}
                    aria-label={`Eliminar categoria ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>

    <AddCategory
      addOpen={addOpen}
      setAddOpen={setAddOpen}
      description={description}
      setDescription={setDescription}
      handleAdd={handleAdd}
      name={name}
      setName={setName}
    ></AddCategory>


  </div>
)
}
