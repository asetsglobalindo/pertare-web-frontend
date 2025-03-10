"use client";
import React, {useState} from "react";
import {useQuery} from "react-query";
import JSCookie from "js-cookie";
import ApiService from "@/lib/ApiService";
import {ContentType} from "@/types/indes";
import moment from "moment";
import Link from "next/link";
import {ArrowUpRight, Loader2} from "lucide-react";
import {Input} from "../ui/input";
import {useDebounce} from "use-debounce";

const CareerList = () => {
  const limit = 12;
  const lang = JSCookie.get("lang") || "id";
  const [isNoData, setIsNoData] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState(0);
  const [results, setResults] = React.useState<ContentType[]>([]);
  const [value, setValue] = useState<string>("");
  const [valueDebounce] = useDebounce(value, 500);

  const {isLoading} = useQuery({
    queryKey: ["career", lang, page, valueDebounce],
    queryFn: async () => await getContent(),
  });

  const getContent = async () => {
    try {
      const params = {
        limit: limit,
        page: page,
        active_status: true,
        type: "career",
        show_single_language: "yes",
        query: valueDebounce,
      };

      const response = await ApiService.get("/content", params);

      if (!response.data.data.length) {
        setIsNoData(true);
      } else {
        setIsNoData(false);
      }

      setTotalData(response.data.pages.total_data);
      setResults([...results, ...response.data.data]);
      return (response.data.data || []) as ContentType[] | [];
    } catch (error) {
      console.log(error);
      setIsNoData(true);
      return [];
    }
  };

  return (
    <section className="max-w-[800px] mx-auto">
      <section>
        <div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search..."
            className="w-full max-w-[300px] ml-auto"
          />
        </div>
      </section>

      {isNoData ? (
        <h1 className="text-center mt-16">Sorry, no data found</h1>
      ) : (
        <section className="grid grid-cols-1 mx-auto gap-8 mt-8">
          {results?.map((data) => (
            <div key={data._id + data.title} className="border">
              <section className="px-4 py-4">
                <div className="flex justify-between">
                  <h1 className="font-semibold title-5">{data.title}</h1>
                  <Link className="flex items-center gap-1 hover:underline" href={`/career/${data.slug}`}>
                    View Job <ArrowUpRight size={18} />
                  </Link>
                </div>
                <p className="mt-4">{data.small_text}</p>
                <div className="text-xs mt-4">Date : {moment(data.created_at).format("DD MMMM YYYY")}</div>
              </section>
            </div>
          ))}
        </section>
      )}
      <section className="mt-24 flex justify-center">
        {results.length < totalData ? (
          <button
            disabled={isLoading}
            onClick={() => setPage(page + 1)}
            className="bg-green-light flex items-center gap-1 text-white px-6 disabled:bg-green-light/80 py-2 rounded-full"
          >
            <span>Load More</span> {isLoading ? <Loader2 className="animate-spin" size={16} color="white" /> : null}
          </button>
        ) : null}
      </section>
    </section>
  );
};

export default CareerList;

