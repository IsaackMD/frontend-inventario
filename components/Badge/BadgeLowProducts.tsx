import { Badge } from "@/components/ui/badge"

type StockBadgeProps = {
  stock: number
  stockMin: number
}

export function StockBadge({ stock, stockMin }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive">
        Agotado
      </Badge>
    )
  }

  if (stock <= stockMin) {
    return (
      <Badge
        className="bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,40%)] border-[hsl(38,92%,50%)]/30 hover:bg-[hsl(38,92%,50%)]/15"
        variant="outline"
      >
        Bajo
      </Badge>
    )
  }

  return null
}