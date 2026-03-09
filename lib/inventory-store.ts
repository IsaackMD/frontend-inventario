export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  stock: number
  stockmin: number
}



export interface StockMovement {
  id: string
  productId: string
  producto: Product
  movementType: "In" | "Out"
  quantity: number
  oldStock: number
  movementDate: string
}


let listeners: (() => void)[] = []

function notify() {
  for (const l of listeners) l()
}

export function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}