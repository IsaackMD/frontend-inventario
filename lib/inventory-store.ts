export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  sku: string
  categoryId: string
  quantity: number
  minStock: number
  price: number
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "entrada" | "salida"
  quantity: number
  previousStock: number
  newStock: number
  note: string
  date: string
}

// Default data
const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronicos",
    description: "Dispositivos electronicos y accesorios",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cat-2",
    name: "Ropa",
    description: "Prendas de vestir y calzado",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cat-3",
    name: "Alimentos",
    description: "Productos alimenticios y bebidas",
    createdAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "cat-4",
    name: "Hogar",
    description: "Articulos para el hogar y decoracion",
    createdAt: "2026-02-01T09:00:00Z",
  },
]

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Laptop HP Pavilion",
    sku: "ELEC-001",
    categoryId: "cat-1",
    quantity: 24,
    minStock: 5,
    price: 15999.0,
  },
  {
    id: "prod-2",
    name: "Mouse Inalambrico Logitech",
    sku: "ELEC-002",
    categoryId: "cat-1",
    quantity: 150,
    minStock: 20,
    price: 499.0,
  },
  {
    id: "prod-3",
    name: "Camiseta Polo Azul",
    sku: "ROPA-001",
    categoryId: "cat-2",
    quantity: 3,
    minStock: 10,
    price: 350.0,
  },
  {
    id: "prod-4",
    name: "Jeans Slim Fit",
    sku: "ROPA-002",
    categoryId: "cat-2",
    quantity: 45,
    minStock: 15,
    price: 799.0,
  },
  {
    id: "prod-5",
    name: "Cafe Molido Premium 1kg",
    sku: "ALIM-001",
    categoryId: "cat-3",
    quantity: 0,
    minStock: 25,
    price: 189.0,
  },
  {
    id: "prod-6",
    name: "Aceite de Oliva 500ml",
    sku: "ALIM-002",
    categoryId: "cat-3",
    quantity: 60,
    minStock: 10,
    price: 145.0,
  },
  {
    id: "prod-7",
    name: "Lampara de Escritorio LED",
    sku: "HOGR-001",
    categoryId: "cat-4",
    quantity: 18,
    minStock: 5,
    price: 650.0,
  },
  {
    id: "prod-8",
    name: "Teclado Mecanico RGB",
    sku: "ELEC-003",
    categoryId: "cat-1",
    quantity: 8,
    minStock: 10,
    price: 1299.0,
  },
]

const defaultMovements: StockMovement[] = [
  {
    id: "mov-1",
    productId: "prod-1",
    productName: "Laptop HP Pavilion",
    type: "entrada",
    quantity: 10,
    previousStock: 14,
    newStock: 24,
    note: "Reposicion de inventario",
    date: "2026-02-05T09:30:00Z",
  },
  {
    id: "mov-2",
    productId: "prod-3",
    productName: "Camiseta Polo Azul",
    type: "salida",
    quantity: 7,
    previousStock: 10,
    newStock: 3,
    note: "Venta mayorista",
    date: "2026-02-06T14:15:00Z",
  },
  {
    id: "mov-3",
    productId: "prod-5",
    productName: "Cafe Molido Premium 1kg",
    type: "salida",
    quantity: 25,
    previousStock: 25,
    newStock: 0,
    note: "Pedido de sucursal norte",
    date: "2026-02-07T11:00:00Z",
  },
  {
    id: "mov-4",
    productId: "prod-2",
    productName: "Mouse Inalambrico Logitech",
    type: "entrada",
    quantity: 50,
    previousStock: 100,
    newStock: 150,
    note: "Compra a proveedor",
    date: "2026-02-07T16:45:00Z",
  },
  {
    id: "mov-5",
    productId: "prod-8",
    productName: "Teclado Mecanico RGB",
    type: "salida",
    quantity: 2,
    previousStock: 10,
    newStock: 8,
    note: "Venta en linea",
    date: "2026-02-08T08:20:00Z",
  },
]

// Singleton store for client-side state
let categories = [...defaultCategories]
let products = [...defaultProducts]
let movements = [...defaultMovements]
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

export function getCategories() {
  return categories
}

export function getProducts() {
  return products
}

export function getMovements() {
  return movements
}

export function addCategory(name: string, description: string) {
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name,
    description,
    createdAt: new Date().toISOString(),
  }
  categories = [...categories, newCat]
  notify()
  return newCat
}

export function deleteCategory(id: string) {
  categories = categories.filter((c) => c.id !== id)
  notify()
}

export function addProduct(
  name: string,
  sku: string,
  categoryId: string,
  quantity: number,
  minStock: number,
  price: number
) {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name,
    sku,
    categoryId,
    quantity,
    minStock,
    price,
  }
  products = [...products, newProduct]

  if (quantity > 0) {
    const mov: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: newProduct.id,
      productName: name,
      type: "entrada",
      quantity,
      previousStock: 0,
      newStock: quantity,
      note: "Stock inicial al crear producto",
      date: new Date().toISOString(),
    }
    movements = [mov, ...movements]
  }

  notify()
  return newProduct
}

export function adjustStock(
  productId: string,
  amount: number,
  type: "entrada" | "salida",
  note: string
) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const previousStock = product.quantity
  const newStock =
    type === "entrada" ? previousStock + amount : Math.max(0, previousStock - amount)

  products = products.map((p) =>
    p.id === productId ? { ...p, quantity: newStock } : p
  )

  const mov: StockMovement = {
    id: `mov-${Date.now()}`,
    productId,
    productName: product.name,
    type,
    quantity: amount,
    previousStock,
    newStock,
    note,
    date: new Date().toISOString(),
  }
  movements = [mov, ...movements]

  notify()
}

export function getCategoryName(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.name ?? "Sin categoria"
}
