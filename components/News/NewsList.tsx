"use client";
import React from "react";
import { useInfiniteQuery } from "react-query";
import JSCookie from "js-cookie";
import ApiService from "@/lib/ApiService";
import { ContentType } from "@/types/indes";
import moment from "moment";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDebounce } from "use-debounce";

const NewsList = () => {
  const limit = 12;
  const lang = JSCookie.get("lang") || "id";
  const [queryValue, setQueryValue] = React.useState("");
  const [queryValueDebounce] = useDebounce(queryValue, 500);
  const [isEndOfData, setIsEndOfData] = React.useState(false);

  const {
    data: contentResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["news", lang, queryValueDebounce],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getContent({ page: pageParam || 1 });
      // If we get back an empty array or fewer items than limit, mark as end of data
      if (!data || data.length === 0 || data.length < limit) {
        setIsEndOfData(true);
      }
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Only return next page if we received full 'limit' items and haven't marked end of data
      if (lastPage && lastPage.length === limit && !isEndOfData) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!lang,
    // Add error handling
    onError: (error) => {
      console.error("Error fetching news data:", error);
      setIsEndOfData(true);
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

      // Check if there are any results
      const results = (response.data.data as ContentType[]) || [];
      return results;
    } catch (error: any) {
      console.error("API Error:", error);
      return [];
    }
  };

  // Reset the end of data state when search query changes
  React.useEffect(() => {
    setIsEndOfData(false);
  }, [queryValueDebounce]);

  return (
    <React.Fragment>
      <section>
        <div className="flex gap-4 ">
          <Input
            value={queryValue}
            className="lg:max-w-[300px]"
            placeholder={lang === "en" ? "Search..." : "Cari..."}
            onChange={(e) => setQueryValue(e.target.value)}
          />
          <Button
            onClick={() => {
              setIsEndOfData(false);
              refetch();
            }}
          >
            Submit
          </Button>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {contentResults?.pages?.flatMap((page, i) =>
          page.map((data) => (
            <div key={data._id} className="border rounded-md">
              <div className="aspect-video">
                <img
                  className="aspect-video object-cover w-full h-full rounded-md"
                  src={
                    data?.thumbnail_images?.[0]?.images?.[0]?.url ||
                    "/placeholder-image.jpg"
                  }
                  alt={data.title || "News image"}
                />
              </div>

              <section className="px-4 pb-4">
                <div className="flex justify-between items-center mt-2 border-b pb-2">
                  <div className="font-medium leading-none">
                    {moment(data.created_at).format("DD MMMM YYYY")}
                  </div>
                </div>

                <h1 className="mt-3 font-semibold title-5 h-[65px] line-clamp-3 overflow-none">
                  {data.title}
                </h1>
                <p className="mt-2 line-clamp-2 text-xs">{data.small_text}</p>

                <Link
                  className="inline-block underline font-semibold uppercase mt-4"
                  href={`/news/${data.slug}`}
                >
                  {lang === "en" ? "Read More" : "Baca Selengkapnya"}
                </Link>
              </section>
            </div>
          ))
        )}
      </section>

      {/* Show loading indicator when initially loading */}
      {isLoading && (
        <div className="mt-8 flex justify-center">
          <Loader2 className="animate-spin" size={24} color="green" />
        </div>
      )}

      {/* No results message */}
      {!isLoading && contentResults?.pages?.[0]?.length === 0 && (
        <div className="mt-8 text-center">
          <p>
            {lang === "en" ? "No results found" : "Tidak ada hasil ditemukan"}
          </p>
        </div>
      )}

      {/* Load more section */}
      <section className="mt-24 flex justify-center">
        {!isLoading && hasNextPage && !isEndOfData ? (
          <button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="bg-green-light flex items-center gap-1 text-white px-6 disabled:bg-green-light/80 py-2 rounded-full"
          >
            <span>{lang === "en" ? "Load More" : "Muat Lagi"}</span>{" "}
            {isFetchingNextPage ? (
              <Loader2 className="animate-spin" size={16} color="white" />
            ) : null}
          </button>
        ) : null}

        {/* End of results message */}
        {!hasNextPage && contentResults?.pages?.[0]?.length > 0 && (
          <p className="text-gray-500">
            {lang === "en" ? "End of results" : "Akhir dari hasil"}
          </p>
        )}
      </section>
    </React.Fragment>
  );
};

export default NewsList;
