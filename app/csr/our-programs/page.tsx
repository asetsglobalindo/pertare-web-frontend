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
export const dynamic = 'force-dynamic'
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

const page = async () => {
  const data: ContentType = await getData(CONTENT_TYPE.CSR_LIST);
  console.log("isis data: ", data);
  const dataTab: ContentType = await getData(CONTENT_TYPE.CSR_CONTENT);
  let count = 0;
  let currentLayout = "right";

  const linksData = [
    {
      href: "/csr",
      image: "/temp/csr.png",
      alt: "Tanggung Jawab Sosial",
      title: "Tanggung Jawab Sosial",
    },
    {
      href: "/csr/collaboration-partnership",
      image: "/temp/kemitraan.png",
      alt: "Kolaborasi & Kemitraan",
      title: "Kolaborasi & Kemitraan",
    },
  ];

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="mt-16">
        <h1 className="title-3 text-center text-green-light">{data.title}</h1>
      </section>

      <section className="container lg:mt-16 mt-8">
        <CSRourPrograms data={dataTab} />
      </section>

      <section className="container mt-8">
        <section className="border-t pt-8 flex flex-col gap-8">
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

            return (
              <section
                className={cn(
                  {
                    "flex-row-reverse": currentLayout == "left",
                  },
                  "lg:flex gap-8"
                )}
                key={d._id + i}
              >
                <div className="lg:w-1/2">
                  <img
                    className="w-full rounded"
                    src={d?.images[0]?.images[0]?.url}
                    alt={d?.title}
                  />
                </div>
                <div className="lg:w-1/2 mt-4 lg:mt-0">
                  <h3 className="title-4 text-3xl">
                    {currentLayout === "left" ? (
                      d.title
                    ) : (
                      <>
                        {d.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span className="text-green-light">
                          {d.title.split(" ").slice(-1)}
                        </span>
                      </>
                    )}
                  </h3>
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
