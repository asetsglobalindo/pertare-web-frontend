// "use client";
// import React, { useState, useEffect } from "react";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import L from "leaflet";
// import { useQuery } from "react-query";
// import ApiService from "@/lib/ApiService";
// import { LocationType } from "@/types/indes";
// import { AlignJustify, Search } from "lucide-react";
// import MapPopup from "../MapPopup";
// import LefleatMapIcon from "@/lib/LefleatIcon";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { cn } from "@/lib/utils";
// import Fuse from "fuse.js";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import "react-leaflet-markercluster/styles";

// const OutletLocatorMap = () => {
//   const [map, setMap] = useState<L.Map | null>(null);
//   const [selectedLocationDetails, setSelectedLocationDetails] =
//     useState<LocationType | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [filteredData, setFilteredData] = useState<LocationType[]>([]);
//   const [openList, setOpenList] = useState<boolean>(false);
//   const [allLocations, setAllLocations] = useState<LocationType[]>([]);

//   // 🔥 Ambil Data Sekali Saat Komponen Mount
//   const { data: locationData, isLoading } = useQuery({
//     queryKey: ["outlet-locator"],
//     queryFn: async () => await getLocation(),
//     onSuccess: (data) => {
//       setAllLocations(data);
//       setFilteredData(data);
//     },
//   });

//   // 🔹 Ambil Semua Data Dari API Sekali
//   const getLocation = async () => {
//     try {
//       const [res1, listingsData] = await Promise.all([
//         ApiService.get("/location", { page: 1, limit: 99999 }),
//         fetchAllListings(),
//       ]);

//       const locationData = res1.data.data || [];

//       // 🔄 **Hilangkan duplikasi berdasarkan kode unik**
//       const uniqueLocations = new Map<string, LocationType>();

//       locationData.forEach((loc: LocationType) => {
//         uniqueLocations.set(loc.code, loc);
//       });

//       listingsData.forEach((listing: LocationType) => {
//         if (!uniqueLocations.has(listing.listing_code)) {
//           uniqueLocations.set(listing.listing_code, listing);
//         }
//       });

//       const combinedResults = Array.from(uniqueLocations.values());

//       // console.log("✅ Hasil Akhir Data yang Sudah Digabung:", combinedResults.length, combinedResults);

//       return Array.from(uniqueLocations.values());
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//       return [];
//     }
//   };

//   // 🔍 Ambil Semua Listings
//   const fetchAllListings = async () => {
//     let page = 1;
//     let allData: LocationType[] = [];

//     while (true) {
//       const res = await ApiService.get(
//         "/listings",
//         { page, limit: 10 },
//         {},
//         true
//       );
//       const listings = res.data.data || [];
//       if (listings.length === 0) break;
//       allData = [...allData, ...listings];
//       page++;
//     }
//     return allData;
//   };

//   // 🔎 **Optimasi Pencarian dengan Fuse.js**
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredData(allLocations); // Reset ke semua data jika kosong
//       return;
//     }

//     const fuse = new Fuse(allLocations, {
//       keys: ["name", "address"], // Cari berdasarkan nama & alamat
//       threshold: 0.3, // Semakin kecil, semakin akurat
//     });

//     const results = fuse.search(searchQuery).map((res) => res.item);
//     setFilteredData(results);
//   }, [searchQuery, allLocations]);

//   return (
//     <section className="w-full h-screen xl:max-h-[800px] relative border rounded-2xl overflow-hidden">
//       {!openList && (
//         <Button
//           onClick={() => setOpenList(true)}
//           className="absolute top-8 right-8 z-40 lg:hidden"
//         >
//           <AlignJustify />
//         </Button>
//       )}

//       <section
//         className={cn(
//           {
//             "-translate-x-[100%] lg:translate-x-0": !openList,
//             "translate-x-0 lg:translate-x-0": openList,
//           },
//           "absolute h-auto top-0 z-30 bg-white w-full lg:max-w-[450px] p-8 transition-all"
//         )}
//       >
//         {/* Search Bar */}
//         <div className="flex justify-end mb-8 lg:hidden">
//           <Button onClick={() => setOpenList((prev) => !prev)}>Close</Button>
//         </div>
//         <div className="flex gap-2">
//           <Input
//             placeholder="Search location"
//             onChange={(e) => setSearchQuery(e.target.value)}
//             value={searchQuery}
//           />
//           <Button>
//             <Search />
//           </Button>
//         </div>

//         {/* List */}
//         {filteredData.length > 0 ? (
//           <div className="mt-8 max-h-[calc(100vh-114px)] overflow-auto grid gap-4">
//             {filteredData.slice(0, 20).map((item) => (
//               <section
//                 key={item._id}
//                 className="flex space-x-2 items-start border-b pb-4 border-black/20"
//               >
//                 <img
//                   className="w-[18px]"
//                   src="/icons/green-pinpoint.svg"
//                   alt="pinpoint"
//                 />
//                 <div>
//                   <button
//                     onClick={() => {
//                       map?.flyTo([+item.lat, +item.long], 15);
//                       setSelectedLocationDetails(item);
//                     }}
//                   >
//                     <h1 className="font-semibold hover:underline text-left">
//                       {item.name}
//                     </h1>
//                   </button>
//                   <span className="inline-block mt-2">{item.address}</span>
//                 </div>
//               </section>
//             ))}
//           </div>
//         ) : (
//           <p className="mt-8 text-center text-gray-500">No results found.</p>
//         )}
//       </section>
//       <MapContainer
//         ref={(map) => {
//           if (map) {
//             setMap(map);
//           }
//         }}
//         center={[-4.775231, 109.042028]}
//         className="w-full h-full  z-20"
//         zoom={6}
//       >
//         <TileLayer url="https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=c56d26e0f3eb454f8dff29acecde52d6" />
//         <MarkerClusterGroup>
//           {locationData
//             ?.filter((d) => {
//               if (selectedLocationDetails) {
//                 return d._id === selectedLocationDetails._id;
//               }

//               return d;
//             })
//             ?.map((item) => (
//               <Marker
//                 eventHandlers={{
//                   click: () => {
//                     map?.flyTo([+item.lat, +item.long], 15);
//                     setTimeout(() => {
//                       setSelectedLocationDetails(item);
//                     }, 500);
//                   },
//                 }}
//                 key={item._id}
//                 position={[+item.lat || 0, +item.long || 0]}
//                 icon={LefleatMapIcon.SPBU}
//               >
//                 <Popup className="m-0">
//                   <MapPopup item={item} />
//                 </Popup>
//               </Marker>
//             ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </section>
//   );
// };

// export default OutletLocatorMap;

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
} from "lucide-react";
import MapPopup from "../MapPopup";
import LefleatMapIcon from "@/lib/LefleatIcon";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
// import moment from "moment";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/styles";

const OutletLocatorMap = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedLocationDetails, setSelectedLocationDetails] =
    useState<LocationType | null>(null);
  const [value, setValue] = useState<string>("");
  const [locationQuery] = useDebounce(value, 1000);
  const [openList, setOpenList] = useState<boolean>(false);

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

            {selectedLocationDetails?.facility?.length ? (
              <div className="mt-4">
                <p className="font-medium uppercase flex items-center gap-2 leading-none border-b pb-2">
                  <Coffee /> Facility :{" "}
                </p>
                <ul className="grid grid-cols-2 mt-2 gap-1">
                  {selectedLocationDetails.facility.split(",").map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {selectedLocationDetails?.lat && selectedLocationDetails?.long ? (
              <a
                className="mt-4 w-full block"
                target="_blank"
                href={
                  "http://www.google.com/maps/place/" +
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
                      setSelectedLocationDetails(item);
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
        <TileLayer url="https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=c56d26e0f3eb454f8dff29acecde52d6" />
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
