import { useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query";
import {
  subscribe,
  getCategories,
  getProducts,
  getMovements,
} from "@/lib/inventory-store"
import api from "./api/api";

export function useCategories() {
  return useSyncExternalStore(subscribe, getCategories, getCategories)
}

export function useProducts() {
  return useSyncExternalStore(subscribe, getProducts, getProducts)
}

export function useMovements() {
  return useSyncExternalStore(subscribe, getMovements, getMovements)
}
export function useDashboardInfo() {
  return useQuery({
    queryKey: ["resumenDashboard"],
    queryFn: async () => {
      const res = await api.get("api/ResumenDashboard");
      return res.data;
    },
  });
}