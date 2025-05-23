import BannerSingleMulti from "@/components/BannerSingleMulti";
import RelatedPage from "@/components/RelatedPage";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
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
      type: CONTENT_TYPE.ABOUT_REWARD,
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

const getDataBanner = async (type: string) => {
  const params = {
    limit: 1,
    page: 1,
    active_status: true,
    type,
    show_single_language: "yes",
  };

  const response = await ApiService.get("/content/banner", params);
  return response.data;
};

const page = async () => {
  const data: ContentType = await getData();
  const types = [
    {
      key: "about",
      type: CONTENT_TYPE.ABOUT_PROFILE,
      href: "/about",
      alt: "Profile",
    },
    {
      key: "management",
      type: CONTENT_TYPE.ABOUT_MANAGEMENT,
      href: "/about/managements",
      alt: "Management",
    },
    {
      key: "ourValue",
      type: CONTENT_TYPE.ABOUT_VALUE,
      href: "/about/our-values",
      alt: "Tata Nilai",
    },
  ];

  const bannerData = await Promise.all(
    types.map(({ type }) => getDataBanner(type))
  );

  const linksData = types.map((item, index) => ({
    href: item.href,
    image: bannerData[index].data.id.banner[0].id.images[0].url,
    alt: item.alt,
    title: bannerData[index].data.id.page_title,
  }));

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="container mt-16 max-w-[900px]">
        <h1 className="title-3 text-green-light text-center">{data.title}</h1>
        <div
          className="mt-8"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>

        <section className="grid grid-cols-1 mt-8 lg:mt-16 md:grid-cols-4 gap-10">
          {data?.images?.map((d) => {
            return (
              <div
                key={d._id}
                className="overflow-hidden w-full rounded-2xl border border-solid border-grey-100 aspect-[4/3] p-4 h-[155px]"
              >
                <img
                  className="w-full h-full object-contain"
                  src={d?.images[0]?.url}
                  alt={d?.title}
                />
              </div>
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
