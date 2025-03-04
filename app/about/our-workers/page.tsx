import BannerSingleMulti from "@/components/BannerSingleMulti";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import {ContentType} from "@/types/indes";
import {Metadata} from "next";
import {notFound} from "next/navigation";
import React from "react";
export const dynamic = 'force-dynamic'
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
      type: CONTENT_TYPE.ABOUT_PREEMPLOYMENT,
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

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      <section className="container mt-16 max-w-[900px]">
        <h1 className="title-3 text-center">{data.title}</h1>
        <div className="mt-8" dangerouslySetInnerHTML={{__html: data.description}}></div>
      </section>
      <section
        className="mt-8 lg:mt-16 text-white min-h-fit md:min-h-[450px] bg-cover bg-no-repeat"
        style={{backgroundImage: `url(${data?.images[0]?.images[0]?.url})`}}
      >
        <section className="container py-8 lg:py-16">
          <h1 className="title-3 text-center">At a Glance</h1>
          <section className="grid grid-cols-2 mt-8 lg:mt-16 gap-2 md:gap-16 md:grid-cols-4">
            {data.body.map((d) => (
              <div key={d._id} className="flex flex-col">
                <h1 className="title-2 text-green-light">{d.button_route}</h1>
                <p className="mt-2">{d.title}</p>
              </div>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};

export default page;

