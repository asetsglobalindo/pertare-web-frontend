import AboutManagement from "@/components/About/AboutManagement";
import BannerSingleMulti from "@/components/BannerSingleMulti";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import RelatedPage from "@/components/RelatedPage";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const result: ContentType = await getData();

  return {
    title: result.meta_title,
    description: result.meta_description,
    openGraph: {
      title: result.meta_title,
      description: result.meta_description,
    },
  };
}

const getData = async () => {
  try {
    const params = {
      limit: 1,
      page: 1,
      active_status: true,
      type: CONTENT_TYPE.ABOUT_MANAGEMENT,
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
  const data: ContentType = await getData();
  const linksData = [
    {
      href: "/about",
      image: "/temp/profile.png",
      alt: "Profile",
      title: "Profil",
    },
    {
      href: "/about/our-values",
      image: "/temp/our-values.png",
      alt: "Tata Nilai",
      title: "Tata Nilai",
    },
    {
      href: "/about/awards",
      image: "/temp/award.png",
      alt: "Penghargaan",
      title: "Penghargaan",
    },
  ];

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="container mt-16 max-w-[900px]">
        <h1 className="title-3 text-center text-green-light">{data.title}</h1>
        <div
          className="mt-8"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </section>
      <section className="mt-8 lg:mt-16 container">
        <AboutManagement data={data} />
      </section>
      {/* Related Page */}
      <RelatedPage links={linksData} />
    </section>
  );
};

export default page;
