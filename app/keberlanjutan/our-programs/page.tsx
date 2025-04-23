import BannerSingleMulti from "@/components/BannerSingleMulti";
import CSRourPrograms from "@/components/CSR/CSRourPrograms";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import RelatedPage from "@/components/RelatedPage";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const result: ContentType = await getData(CONTENT_TYPE.CSR_LIST);

  return {
    title: result.meta_title,
    description: result.meta_description,
    openGraph: {
      title: result.meta_title,
      description: result.meta_description,
    },
  };
}

const getData = async (type: string) => {
  try {
    const params = {
      limit: 1,
      page: 1,
      active_status: true,
      type: type,
      show_single_language: "yes",
    };

    const response = await ApiService.get("/content", params);

    if (response.data.status !== 200) {
      throw new Error(response.data.message || response.data.err);
    }

    if (!response.data.data.length) {
      throw new Error("Data not found");
    }

    return response.data.data[0];
  } catch (error) {
    console.log(error);
    notFound();
  }
};

const getDataBannerCSR = async () => {
  const paramsCSR = {
    limit: 1,
    page: 1,
    active_status: true,
    type: CONTENT_TYPE.CSR,
    show_single_language: "yes",
  };

  const responseCSR = await ApiService.get("/content/banner", paramsCSR);
  return responseCSR.data;
};

const page = async () => {
  const data: ContentType = await getData(CONTENT_TYPE.CSR_LIST);
  const dataTab: ContentType = await getData(CONTENT_TYPE.CSR_CONTENT);
  const dataCSR: any = await getDataBannerCSR();
  let count = 0;
  let currentLayout = "right";

  const linksData = [
    {
      href: "/keberlanjutan",
      image: dataCSR.data.id.banner[0].id.images[0].url,
      alt: "Tanggung Jawab Sosial",
      title: dataCSR.data.id.page_title,
    },
    {
      href: "/keberlanjutan/collaboration-partnership",
      image: "/temp/banner-collaboration-partnership.png",
      alt: "Kolaborasi & Kemitraan",
      title: "Kolaborasi & Kemitraan",
    },
  ];

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="container lg:mt-16 mt-8">
        <CSRourPrograms data={dataTab} />
      </section>

      <section className="container mt-8">
        <section className="flex flex-col gap-8" style={{ marginTop: "70px" }}>
          {data.body.map((d, i) => {
            if (count == 2) {
              count = 1;
              if (currentLayout == "right") {
                currentLayout = "left";
              } else {
                currentLayout = "right";
              }
            } else {
              count = count + 1;
            }

            // Category by index section
            const categories = [
              "Pertamina Cerdas",
              "Pertamina Sehat",
              "Pertamina Berdikari",
              "Pertamina Hijau",
            ];
            const category = categories[i % categories.length];

            // Category Possition
            const categoryPosition =
              currentLayout === "left" ? "left-0" : "right-0";

            return (
              <section
                className={cn(
                  {
                    "flex-row-reverse": currentLayout == "left",
                  },
                  "lg:flex gap-8 relative pt-8"
                )}
                key={d._id + i}
              >
                {/* Green line section */}
                <div className="absolute top-0 w-full border-t border-green-light">
                  <span
                    className={cn(
                      "bg-green-light px-4 py-2 text-white font-semibold text-sm absolute",
                      categoryPosition
                    )}
                    style={{ top: "-20px", borderRadius: "10px" }}
                  >
                    {category}
                  </span>
                </div>

                {/* Image */}
                <div className="lg:w-1/2">
                  <img
                    className="w-full rounded"
                    src={d?.images[0]?.images[0]?.url}
                    alt={d?.title}
                  />
                </div>

                {/* Content */}
                <div className="lg:w-1/2 mt-4 lg:mt-0">
                  <h3 className="title-4 text-3xl">{d.title}</h3>
                  <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{ __html: d.text }}
                  ></div>
                </div>
              </section>
            );
          })}
        </section>
      </section>
      {/* Related Page */}
      <RelatedPage links={linksData} />
    </section>
  );
};

export default page;
