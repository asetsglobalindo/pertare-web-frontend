import BannerSingleMulti from "@/components/BannerSingleMulti";
import PartnershipCard from "@/components/PartnershipCard";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import {ContentType} from "@/types/indes";
// import {X} from "lucide-react";
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
      type: CONTENT_TYPE.MITRA_PAGE,
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
const getDataRelated = async () => {
  try {
    const params = {
      limit: 99,
      page: 1,
      active_status: true,
      type: CONTENT_TYPE.MITRA,
      show_single_language: "yes",
    };

    const response = await ApiService.get("/content", params);

    if (response.data.status !== 200) {
      throw new Error(response.data.message || response.data.err);
    }

    if (!response.data.data.length) {
      throw new Error("Data not found");
    }

    return response.data.data;
  } catch (error) {
    console.log(error);
    notFound();
  }
};

const page = async () => {
  const data: ContentType = await getData();
  const related: ContentType[] | [] = await getDataRelated();

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      {/* top */}
      <section className="container mt-16">
        <section className=" max-w-[900px] mx-auto">
          <h1 className="title-3 text-center text-green-light">{data.title}</h1>
          <div className="mt-8 dont-reset" dangerouslySetInnerHTML={{__html: data.description}}></div>
        </section>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container mt-8 lg:mt-16 gap-4">
        {related.map((c) => (
          <PartnershipCard key={c._id} data={c} />
        ))}
      </section>
    </section>
  );
};

export default page;

