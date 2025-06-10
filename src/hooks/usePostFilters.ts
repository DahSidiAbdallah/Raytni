import { useState, useCallback } from 'react';
import { PostFilter } from '@/services/postService';

interface UsePostFiltersResult {
  filters: PostFilter;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterLocation: string;
  setFilterLocation: (location: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook to manage post filtering state and logic
 */
export const usePostFilters = (): UsePostFiltersResult => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  // Compute the current filters object for the API
  const filters: PostFilter = {};
  
  if (filterType !== "all") {
    filters.category = filterType;
  }
  
  if (filterStatus !== "all") {
    filters.status = filterStatus as 'lost' | 'found';
  }
  
  if (filterLocation !== "all") {
    filters.locationName = filterLocation;
  }
  
  if (searchTerm) {
    filters.searchTerm = searchTerm;
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || 
                          filterType !== "all" || 
                          filterStatus !== "all" || 
                          filterLocation !== "all";

  // Function to clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterLocation("all");
  }, []);

  return {
    filters,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    clearFilters,
    hasActiveFilters
  };
};

export default usePostFilters;