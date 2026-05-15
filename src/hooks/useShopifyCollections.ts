import { useQuery } from "@tanstack/react-query";
import { fetchCollections, fetchCollectionByHandle } from "@/lib/shopify";

export const useShopifyCollections = (first = 50) =>
  useQuery({
    queryKey: ["shopify-collections", first],
    queryFn: () => fetchCollections(first),
    staleTime: 1000 * 60 * 5,
  });

export const useShopifyCollection = (handle?: string, first = 50) =>
  useQuery({
    queryKey: ["shopify-collection", handle, first],
    queryFn: () => fetchCollectionByHandle(handle!, first),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
