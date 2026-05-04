import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductByHandle } from "@/lib/shopify";

export const useShopifyProducts = (query?: string, first = 50) =>
  useQuery({
    queryKey: ["shopify-products", query, first],
    queryFn: () => fetchProducts(first, query),
    staleTime: 1000 * 60 * 5,
  });

export const useShopifyProduct = (handle?: string) =>
  useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
