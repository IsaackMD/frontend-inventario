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
import { Button } from "@/components/ui/button"

interface AddCategoryProps {
  addOpen: boolean
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  handleAdd: () => void
}

export function AddCategory({
    addOpen,setAddOpen,
    name,setName,
    description, setDescription,
    handleAdd
}: AddCategoryProps) {

    {/* Add Category Dialog */}
    return (
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Nueva Categoria</DialogTitle>
            <DialogDescription>
              Agrega una nueva categoria para organizar tus productos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-name">Nombre</Label>
              <Input
                id="cat-name"
                placeholder="Ej: Herramientas"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-desc">Descripcion (opcional)</Label>
              <Input
                id="cat-desc"
                placeholder="Descripcion breve de la categoria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!name.trim()}>
              Crear Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
)}