import { useSyncExternalStore } from "react"
import { useQuery } from "@tanstack/react-query";
import api from "./api/api";


export function useCategories() {
  return useQuery({
    queryKey: ["Categories"],
    queryFn: async () => {
      const res = await api.get("api/Categories");
      return res.data;
    },
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const { data } = await api.get("api/Products");
      const { isSuccess, value, error } = data;
      if (!isSuccess) {
        return [];
      }

      return value;
    },
  });
}




export function useHisorialStock() {
  return useQuery({
    queryKey: ["HistorialStock"],
    queryFn: async () => {
      const { data } = await api.get("api/Stock");
      const { isSuccess, value, error } = data;
      if (!isSuccess) {
        return [];
      }

      return value;
    },
  });
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

export function useGetLowProducts() {
  return useQuery({
    queryKey: ["low-products"],
    queryFn: async () => {
      const res = await api.get("api/ResumenDashboard/low-products");
      return res.data;
    },
  });
}
export function useLastMovements() {
  return useQuery({
    queryKey: ["LastMovements"],
    queryFn: async () => {
      const { data } = await api.get("api/Stock/LastMovements");
      const { isSuccess, value, error } = data;
      if (!isSuccess) {
        return [];
      }

      return value;
    },
  });
}