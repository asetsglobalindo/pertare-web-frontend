import Form from "./form";
import BannerSingleMulti from "@/components/BannerSingleMulti";
import RelatedPage from "@/components/RelatedPage";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
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

const CollaborationPartnership = async () => {
  const data: ContentType = await getData(CONTENT_TYPE.CSR_LIST);
  const linksData = [
    {
      href: "/csr",
      image: "/temp/csr.png",
      alt: "Tanggung Jawab Sosial",
      title: "Tanggung Jawab Sosial",
    },
    {
      href: "/csr/our-programs",
      image: "/temp/program-kami.png",
      alt: "Program Kami",
      title: "Program Kami",
    },
  ];

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="mt-16">
        <Form />
      </section>
      <RelatedPage links={linksData} />
    </section>
  );
};

export default CollaborationPartnership;
