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
import { Category } from "@/lib/inventory-store"


interface DeleteCategoryProps {
  deleteTarget: any
  setDeleteTarget: (value: any) => void
  deleteTargetProductCount: number
  deleteTargetCategory: Category
  handleDelete: () => void
}

export function DeleteCategory({
    deleteTarget,setDeleteTarget,
    deleteTargetProductCount,deleteTargetCategory,
    handleDelete
}: DeleteCategoryProps) {

    {/* Delete Confirmation Dialog */}
    return (
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Eliminar Categoria</DialogTitle>
            <DialogDescription>
              {deleteTargetProductCount > 0
                ? `La categoria "${deleteTargetCategory?.name}" tiene ${deleteTargetProductCount} producto${deleteTargetProductCount !== 1 ? "s" : ""} asociado${deleteTargetProductCount !== 1 ? "s" : ""}. Los productos no seran eliminados pero quedaran sin categoria.`
                : `Estas seguro de que deseas eliminar la categoria "${deleteTargetCategory?.name}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
)}