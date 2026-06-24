import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const normalizeResource = (resource = "") => resource.toLowerCase();

const updateCounters = (filters, responses) => {
  const counters = responses.reduce((accumulator, response) => {
    const resource = response.data?.header?.resource;
    if (resource) accumulator[normalizeResource(resource)] = response.data.header.count;
    return accumulator;
  }, {});

  return filters.map((filter) => ({
    ...filter,
    counter: Object.hasOwn(counters, normalizeResource(filter.resource))
      ? counters[normalizeResource(filter.resource)]
      : filter.counter,
  }));
};

const useOrderResources = (initialFilters) => {
  const [resources] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInitialResources = useCallback(async () => {
    try {
      setLoading(true);
      const responses = await Promise.all(
        resources.map((filter) => api.get(`/${filter.resource}`))
      );
      const updatedFilters = updateCounters(resources, responses);
      const activeResource = updatedFilters.find((filter) => filter.active);
      const activeResponse = responses.find(
        (response) =>
          normalizeResource(response.data?.header?.resource) ===
          normalizeResource(activeResource?.resource)
      );

      setFilters(updatedFilters);
      setOrders(activeResponse?.data?.payload || responses[0]?.data?.payload || []);
    } catch (error) {
      console.error("Error loading order resources:", error);
    } finally {
      setLoading(false);
    }
  }, [resources]);

  useEffect(() => {
    loadInitialResources();
  }, [loadInitialResources]);

  const selectFilter = useCallback(
    async (filterId) => {
      const selectedFilter = filters.find((filter) => filter.id === filterId);
      if (!selectedFilter) return;

      try {
        setLoading(true);
        const response = await api.get(`/${selectedFilter.resource}`);
        const updatedFilters = updateCounters(
          filters.map((filter) => ({ ...filter, active: filter.id === filterId })),
          [response]
        );

        setFilters(updatedFilters);
        setOrders(response.data?.payload || []);
      } catch (error) {
        console.error("Error selecting order resource:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  return {
    filters,
    orders,
    loading,
    selectFilter,
    setFilters,
    setLoading,
    setOrders,
  };
};

export default useOrderResources;
