import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api/api";

// ====================================
// OBTENER CATEGORÍAS (GET)
// ====================================
export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/Categories");
      return res.data;
    },
  });
}

// ====================================
// CREAR PRODUCTO (POST) ✅
// ====================================
interface CreateProductDto {
  name: string;
  description: string;
  stock: number;
  stockmin: number;
  CategoryId: string;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateProductDto) => {
      const res = await api.post("/api/Products", body);
      return res.data;
    },
    onSuccess: () => {
      // Invalida la query de productos para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ====================================
// Action Increment / Decrement (POST) ✅
// ====================================
interface ActionProduct {
  ProductId: string;
  quantity: number;
}

export function useIncrement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ActionProduct) => {
      const {data} = await api.post("/api/Products/Increase", body);
      const {value, error, IsSuccess} = data;
      
      if(!IsSuccess) console.log(error);

      return value
    },
    onSuccess: () => {
      // Invalida la query de productos para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
}


export function useDecrement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ActionProduct) => {
      const {data} = await api.post("/api/Products/Decrease", body);
      const {value, error, IsSuccess} = data;

      if(!IsSuccess) console.log(error);

      return value
    },
    onSuccess: () => {
      // Invalida la query de productos para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ["Products"] });
    },
  });
}


// ====================================
// Add Category (POST) ✅
// ====================================
interface AddCategory {
  name: string;
  description: string;
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: AddCategory) => {
      const {data} = await api.post("/api/Categories", body);
      const {value, error, IsSuccess} = data;

      if(!IsSuccess) console.log(error);

      return value
    },
    onSuccess: () => {
      // Invalida la query de productos para que se recargue automáticamente
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
    },
  });
}