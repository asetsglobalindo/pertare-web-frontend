"use client";
import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "react-query";
import ApiService from "@/lib/ApiService";
import { LocationType } from "@/types/indes";
import {
  AlignJustify,
  ChevronLeft,
  Clock,
  Coffee,
  Fuel,
  MoveRight,
  Search,
  Compass,
} from "lucide-react";
import MapPopup from "../MapPopup";
import LefleatMapIcon from "@/lib/LefleatIcon";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/styles";
import axios from "axios";

const OutletLocatorMap = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedLocationDetails, setSelectedLocationDetails] =
    useState<LocationType | null>(null);
  const [value, setValue] = useState<string>("");
  const [locationQuery] = useDebounce(value, 1000);
  const [openList, setOpenList] = useState<boolean>(false);
  const [surroundingArea, setSurroundingArea] = useState<string[]>();
  const [facilities, setFacilities] = useState<string[]>([]);

  const { data: locationData, refetch } = useQuery({
    queryKey: ["outlet-locator"],
    queryFn: async () =>
      await getLocation({ limit: 99999999, search: locationQuery }),
  });

  const getLocation = async ({
    limit,
    search,
  }: {
    limit: number;
    search?: string;
  }) => {
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

  const fetchSurroundingArea = async (code: string) => {
    try {
      const res = await axios.get(
        `https://pertare.asets.id/api/listings/${code}`
      );

      if (!res.data.success || !res.data.data) {
        throw new Error(
          res.data.message || "Failed to fetch surrounding area data"
        );
      }

      // Get data surrounding area
      const surroundingAreas: { surrounding_area_name: string }[] =
        res.data.data.surrounding_areas || [];
      setSurroundingArea(
        surroundingAreas.length
          ? surroundingAreas.map((a) => a.surrounding_area_name)
          : ["-"]
      );

      // Get data facilities
      const facilitiesData: { facility_name: string }[] =
        res.data.data.facilities || [];
      const newFacilities = facilitiesData.length
        ? facilitiesData.map((f) => f.facility_name)
        : ["-"];

      setFacilities(newFacilities);
    } catch (error) {
      console.error("Error fetching surrounding area:", error);
      setSurroundingArea(["-"]);
      setFacilities(["-"]);
    }
  };

  const handleSelectLocation = (item: LocationType) => {
    setSelectedLocationDetails(item);
    setSurroundingArea([]);
    setFacilities([]);
    if (item.code) {
      fetchSurroundingArea(item.code);
    }
  };

  return (
    <section className="w-full h-screen xl:max-h-[800px] relative border rounded-2xl overflow-hidden">
      {!openList ? (
        <Button
          onClick={() => setOpenList(true)}
          className="absolute top-8 right-8 z-40 lg:hidden"
        >
          <AlignJustify />
        </Button>
      ) : null}
      <section
        className={cn(
          {
            "-translate-x-[100%] lg:translate-x-0": !openList,
            "translate-x-0 lg:translate-x-0": openList,
          },
          "absolute h-auto top-0 z-30 bg-white w-full lg:max-w-[450px] p-8 transition-all"
        )}
      >
        {/* search bar */}
        <div className="flex justify-end mb-8 lg:hidden">
          <Button onClick={() => setOpenList((prev) => !prev)}>Close</Button>
        </div>
        <div className="flex gap-2 ">
          <Input
            placeholder="Search location"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <Button onClick={() => refetch()}>
            <Search />
          </Button>
        </div>

        {/* list */}
        {selectedLocationDetails ? (
          <div className="mt-8 max-h-[calc(100vh-114px)] overflow-auto">
            <button
              onClick={() => setSelectedLocationDetails(null)}
              className="flex items-center border-b pb-2 mb-4 w-full"
            >
              <ChevronLeft />{" "}
              <span className="leading-none underline font-medium">
                BACK TO RESULT
              </span>
            </button>
            <h1 className="lg:text-lg uppercase font-semibold">
              {selectedLocationDetails.name}
            </h1>
            <p className="mt-2">{selectedLocationDetails.address}</p>

            {selectedLocationDetails?.operational_hour?.length ? (
              <div className="mt-4">
                <p className="font-medium uppercase flex items-center gap-2 leading-none border-b pb-2">
                  <Clock size={18} />
                  operating hours :{" "}
                </p>
                <p className="mt-2">
                  {selectedLocationDetails.operational_hour}
                </p>
              </div>
            ) : null}
            {selectedLocationDetails?.fuel?.length ? (
              <div className="mt-4">
                <p className="font-medium uppercase flex items-center gap-2 leading-none border-b pb-2">
                  <Fuel size={18} />
                  Fuel :{" "}
                </p>
                <ul className="grid grid-cols-2 mt-2 gap-1">
                  {selectedLocationDetails.fuel.split(",").map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedLocationDetails?.facility?.length ||
            (facilities && facilities.length) ? (
              <div className="mt-4">
                <p className="font-medium uppercase flex items-center gap-2 leading-none border-b pb-2">
                  <Coffee /> Facility :{" "}
                </p>
                <ul className="grid grid-cols-2 mt-2 gap-1">
                  {selectedLocationDetails?.facility?.split(",").map((f) => (
                    <li key={f.trim()}>{f.trim()}</li>
                  ))}

                  {/* Filtered Data */}
                  {facilities
                    ?.filter(
                      (f) =>
                        !selectedLocationDetails?.facility
                          ?.split(",")
                          .map((item) => item.trim().toLowerCase())
                          .includes(f.trim().toLowerCase())
                    )
                    .map((f, index) => (
                      <li key={`api-${index}`}>{f.trim()}</li>
                    ))}
                </ul>
              </div>
            ) : null}

            {surroundingArea && surroundingArea.length > 0 ? (
              <div className="mt-4">
                <p className="font-medium uppercase flex items-center gap-2 leading-none border-b pb-2">
                  <Compass /> Surrounding Area:{" "}
                </p>
                <ul className="grid grid-cols-2 mt-2 gap-1">
                  {surroundingArea.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedLocationDetails?.lat && selectedLocationDetails?.long ? (
              <a
                className="mt-4 w-full block"
                target="_blank"
                href={
                  "https://www.google.com/maps/place/" +
                  selectedLocationDetails.lat +
                  "," +
                  selectedLocationDetails.long
                }
              >
                <Button className="w-full flex justify-center items-center">
                  Direction <MoveRight />
                </Button>
              </a>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              {
                "mt-8": locationData?.length,
              },
              "grid max-h-[calc(100vh-114px)] grid-cols-1 overflow-auto gap-4"
            )}
          >
            {locationData?.slice(0, 20)?.map((item) => (
              <section
                key={item._id}
                className="flex space-x-2 items-start border-b pb-4 border-black/20"
              >
                <img
                  className="w-[18px]"
                  src="/icons/green-pinpoint.svg"
                  alt="pinpoint"
                />
                <div>
                  <button
                    onClick={() => {
                      map?.flyTo([+item.lat, +item.long], 15);
                      handleSelectLocation(item);
                    }}
                  >
                    <h1 className="font-semibold hover:underline text-left">
                      {item.name}
                    </h1>
                  </button>
                  <span className="inline-block mt-2">{item.address}</span>
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
      <MapContainer
        ref={(map) => {
          if (map) {
            setMap(map);
          }
        }}
        center={[-4.775231, 109.042028]}
        className="w-full h-full  z-20"
        zoom={6}
      >
        <TileLayer 
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup>
          {locationData
            ?.filter((d) => {
              if (selectedLocationDetails) {
                return d._id === selectedLocationDetails._id;
              }

              return d;
            })
            ?.map((item) => (
              <Marker
                eventHandlers={{
                  click: () => {
                    map?.flyTo([+item.lat, +item.long], 15);
                    setTimeout(() => {
                      setSelectedLocationDetails(item);
                    }, 500);
                  },
                }}
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
  );
};

export default OutletLocatorMap;
