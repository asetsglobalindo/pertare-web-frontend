"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "react-query";
import ApiService from "@/lib/ApiService";
import { HomeType, LocationType } from "@/types/indes";
import { useDebounce } from "use-debounce";
import { Loader2Icon } from "lucide-react";
import LefleatMapIcon from "@/lib/LefleatIcon";
import MapPopup from "./MapPopup";
import "react-leaflet-markercluster/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";

const HomeLocator: React.FC<{ data: HomeType }> = ({ data }) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [value, setValue] = useState<string>("");
  const [locationQuery] = useDebounce(value, 1000);

  const { data: locationData } = useQuery({
    queryKey: ["outlet-locator"],
    queryFn: async () => await getLocation(99999999),
  });

  const { data: locationSuggestion, isLoading: isLoadingSuggestion } = useQuery(
    {
      queryKey: ["outlet-locator-suggestion", locationQuery],
      queryFn: async () => await getLocation(5, locationQuery),
      enabled: !!locationQuery.length,
    }
  );

  const getLocation = async (limit: number = 5, search?: string) => {
    try {
      const query: {
        page: number;
        limit: number;
        query?: string;
        lat: number | null;
        long: number | null;
      } = {
        page: 1,
        limit: limit,
        lat: null,
        long: null,
      };

      if (search) {
        query.query = search;
      }

      const res = await ApiService.get("/location", query);

      if (res.data.status !== 200) {
        throw new Error(res.data.message || res.data.err);
      }

      return res.data.data as LocationType[] | [];
    } catch (error) {
      console.log(error);
    }
  };

  if (typeof window === "undefined") {
    return null;
  }
  return (
    <section
      className="mt-8 lg:mt-16"
      style={{
        background: "url(/texture/grid.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 550px",
      }}
    >
      <section className="container pt-16 lg:pt-8 flex flex-col lg:flex-row lg:space-x-16">
        <section className="w-full lg:w-5/12 lg:mt-16">
          <div className="">
            <span className="title-4 font-normal text-green-light">
              {data.section3.small_text}
            </span>
            <h1 className="text-white title-2 leading-snug mt-4 max-w-[400px]">
              {data.section3.title}
            </h1>
          </div>
          <section className="relative">
            <div
              className={cn(
                {
                  "overflow-hidden": !locationSuggestion?.length,
                },
                "flex bg-white items-center justify-center  w-full px-4 z-40 rounded-[15px] lg:rounded-[20px] mt-4 lg:mt-8 relative"
              )}
            >
              <img
                className="h-4 w-4 lg:w-6 lg:h-6 mr-4"
                src="/icons/search-locator.png"
                alt="search-locator"
              />
              <div className="w-full">
                <input
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  className="lg:text-lg h-14 lg:h-[70px] outline-none bg-transparent w-full max-w-[95%] "
                  type="text"
                  placeholder="Search your location"
                />
              </div>
              {isLoadingSuggestion ? (
                <div className="h-4 w-4  flex justify-center items-center">
                  <Loader2Icon className="animate-spin " />
                </div>
              ) : (
                <img
                  className="h-10 w-10 lg:w-[52px] lg:h-[52px]"
                  src="/icons/search-btn.png"
                  alt="search"
                />
              )}
            </div>
            <div
              className={cn(
                {
                  "h-0": !locationSuggestion?.length,
                  "bg-white scale-y-0 shadow-md": locationSuggestion?.length,
                },
                "w-full transition-all px-8 pb-4 pt-8 scale-y-100  rounded-b-[20px] -mt-4 duration-500 overflow-hidden absolute z-[35]"
              )}
            >
              <ul
                className={cn({
                  "border-t border-black/20": locationSuggestion?.length,
                })}
              >
                {locationSuggestion?.map((d, index) => (
                  <li
                    onClick={() => {
                      map?.flyTo([+d.lat, +d.long], 15);
                      setValue(d.name + " " + d.address);
                    }}
                    key={index}
                    className="lg:text-base text-black/50 pt-4 line-clamp-1 cursor-pointer hover:text-black hover:underline"
                  >
                    {d.name} {d.address}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>
        <section className="w-full lg:w-7/12 mt-8">
          <MapContainer
            ref={(map) => {
              if (map) {
                setMap(map);
              }
            }}
            center={[-4.775231, 109.042028]}
            className="h-[400px] lg:h-[550px] xl:h-[650px] rounded-[20px] z-[30]"
            zoom={6}
          >
            <TileLayer 
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
              {locationData?.map((item) => (
                <Marker
                  key={item._id}
                  position={[+item.lat || 0, +item.long || 0]}
                  icon={LefleatMapIcon.SPBU}
                >
                  <Popup className="m-0">
                    <MapPopup item={item} />
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </section>
      </section>
    </section>
  );
};

export default HomeLocator;
