"use client";
import React from "react";
import { useQuery } from "react-query";
import JSCookie from "js-cookie";
import ApiService from "@/lib/ApiService";
import { ContentType } from "@/types/indes";
import moment from "moment";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";

const NewsList = () => {
  const limit = 12;
  const lang = JSCookie.get("lang") || "id";
  const [queryValue, setQueryValue] = React.useState("");
  const [queryValueDebounce] = useDebounce(queryValue, 500);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const {
    data: contentResults,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["news", lang, queryValueDebounce, currentPage],
    queryFn: async () => {
      const response = await getContent({ page: currentPage });
      return response;
    },
    enabled: !!lang,
    onError: (error) => {
      console.error("Error fetching news data:", error);
    },
  });

  const getContent = async ({ page }: { page: number }) => {
    try {
      const params = {
        limit: limit,
        page: page,
        active_status: true,
        type: "news",
        show_single_language: "yes",
        query: queryValueDebounce,
      };

      const response = await ApiService.get("/content", params);

      // Get results from API response - backend now handles sorting
      let results = (response.data.data as ContentType[]) || [];
      
      // Calculate total pages based on response (check pages object first like other components)
      const total = response.data.pages?.total_data || response.data.total || response.data.totalCount || 0;
      let calculatedTotalPages = Math.ceil(total / limit);
      
      // Fallback: if no total count, use more conservative approach
      if (total === 0) {
        if (results.length < limit) {
          // If we got less than limit, this is the last page
          calculatedTotalPages = currentPage;
          setHasNextPage(false);
        } else {
          // If we got full limit, we don't know total pages yet, so don't show total
          calculatedTotalPages = 0; // This will hide the "of X" part in pagination
          setHasNextPage(true); // Assume there might be more pages
        }
      } else {
        // We have total count, so we can determine if there are more pages
        setHasNextPage(currentPage < calculatedTotalPages);
      }
      
      console.log("Total items:", total, "Total pages:", calculatedTotalPages);
      
      setTotalPages(calculatedTotalPages);
      
      return results;
    } catch (error: any) {
      console.error("API Error:", error);
      return [];
    }
  };

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
    if (queryValueDebounce !== queryValue) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [queryValueDebounce, queryValue]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (totalPages > 0 ? currentPage < totalPages : hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const clearSearch = () => {
    setQueryValue("");
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    refetch();
  };

  
  return (
    <React.Fragment>
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center"
      >
        <motion.div 
          className="relative w-full max-w-sm"
          animate={{ 
            scale: isSearchFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute left-4 top-3 z-10 flex items-center justify-center w-6 h-6"
            animate={{ 
              color: isSearchFocused ? "#10b981" : "#6b7280",
              scale: isSearching ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              duration: isSearching ? 0.6 : 0.2,
              repeat: isSearching ? Infinity : 0
            }}
          >
            <Search size={20} />
          </motion.div>
          
          <Input
            value={queryValue}
            className="h-12 pl-12 pr-12 border-2 transition-all duration-300 focus:border-green-light focus:ring-2 focus:ring-green-light/20 focus:shadow-lg rounded-full text-center"
            placeholder={lang === "en" ? "Search news..." : "Cari berita..."}
            onChange={(e) => setQueryValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          
          <AnimatePresence>
            {queryValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center w-6 h-6"
                onClick={clearSearch}
              >
                <X size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.section>
      
      {/* Search Results Info */}
      <AnimatePresence>
        {queryValueDebounce && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            {isLoading ? (
              <span>{lang === "en" ? "Searching..." : "Mencari..."}</span>
            ) : (
              <span>
                {lang === "en" ? "Search results for" : "Hasil pencarian untuk"} "{queryValueDebounce}"
                {contentResults && contentResults.length > 0 && (
                  <span className="ml-2 text-green-600 font-medium">
                    ({contentResults.length} {lang === "en" ? "found" : "ditemukan"})
                  </span>
                )}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.1,
              staggerChildren: 0.1
            }
          }
        }}
      >
        <AnimatePresence mode="wait">
          {contentResults?.map((data, index) => (
            <Link key={data._id} href={`/news/${data.slug}`}>
              <motion.div 
                className="border rounded-md group cursor-pointer"
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 20,
                    scale: 0.95
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                whileTap={{
                  scale: 0.98
                }}
                layout
              >
              <div className="aspect-video overflow-hidden rounded-t-md relative">
                <motion.img
                  className="aspect-video object-cover w-full h-full"
                  src={
                    data?.thumbnail_images?.[0]?.images?.[0]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={data.title || "News image"}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>

              <motion.section 
                className="px-4 pb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <motion.div 
                  className="flex justify-between items-center mt-2 border-b pb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="font-medium leading-none">
                    {moment(data.created_at).format("DD MMMM YYYY")}
                  </div>
                </motion.div>

                <motion.h1 
                  className="mt-3 font-semibold title-5 h-[65px] line-clamp-3 overflow-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  {data.title}
                </motion.h1>
                
                <motion.p 
                  className="mt-2 line-clamp-2 text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {data.small_text}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="text-green-light font-semibold uppercase mt-4 hover:text-green-600 transition-colors duration-200"
                >
                  {lang === "en" ? "Read More" : "Baca Selengkapnya"}
                </motion.div>
              </motion.section>
            </motion.div>
            </Link>
        ))}
        </AnimatePresence>
      </motion.section>

      {/* Show loading indicator when initially loading */}
      {isLoading && (
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={24} color="green" />
          </motion.div>
        </motion.div>
      )}

      {/* No results message */}
      <AnimatePresence>
        {!isLoading && contentResults?.length === 0 && (
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg text-gray-500 mb-2">
                {lang === "en" ? "No results found" : "Tidak ada hasil ditemukan"}
              </p>
              {queryValueDebounce && (
                <p className="text-sm text-gray-400">
                  {lang === "en" ? "Try searching with different keywords" : "Coba cari dengan kata kunci yang berbeda"}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination section */}
      {!isLoading && contentResults && contentResults.length > 0 && totalPages > 1 && (
        <motion.section 
          className="mt-24 flex justify-center items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              {lang === "en" ? "Previous" : "Sebelumnya"}
            </Button>
          </motion.div>
          
          <motion.span 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {totalPages > 0 
              ? `${lang === "en" ? "Page" : "Halaman"} ${currentPage} ${lang === "en" ? "of" : "dari"} ${totalPages}`
              : `${lang === "en" ? "Page" : "Halaman"} ${currentPage}`
            }
          </motion.span>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={totalPages > 0 ? currentPage === totalPages : !hasNextPage}
              className="flex items-center gap-2"
            >
              {lang === "en" ? "Next" : "Selanjutnya"}
              <ChevronRight size={16} />
            </Button>
          </motion.div>
        </motion.section>
      )}
    </React.Fragment>
  );
};

export default NewsList;
