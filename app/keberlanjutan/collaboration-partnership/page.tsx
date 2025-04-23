import Form from "./form";
// import BannerSingleMulti from "@/components/BannerSingleMulti";
import RelatedPage from "@/components/RelatedPage";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
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

const getDataBannerOurPrograms = async () => {
  const paramsOurPrograms = {
    limit: 1,
    page: 1,
    active_status: true,
    type: CONTENT_TYPE.CSR_LIST,
    show_single_language: "yes",
  };

  const responseOurPrograms = await ApiService.get(
    "/content/banner",
    paramsOurPrograms
  );
  return responseOurPrograms.data;
};

const CollaborationPartnership = async () => {
  // const data: ContentType = await getData(CONTENT_TYPE.CSR_LIST);
  const dataCSR: any = await getDataBannerCSR();
  const dataOurPrograms: any = await getDataBannerOurPrograms();
  const linksData = [
    {
      href: "/keberlanjutan",
      image: dataCSR.data.id.banner[0].id.images[0].url,
      alt: "Tanggung Jawab Sosial",
      title: dataCSR.data.id.page_title,
    },
    {
      href: "/keberlanjutan/our-programs",
      image: dataOurPrograms.data.id.banner[0].id.images[0].url,
      alt: "Program Kami",
      title: dataOurPrograms.data.id.page_title,
    },
  ];

  return (
    <section>
      <section className="relative">
        <div className="relative w-full">
          <picture className="relative w-full">
            <source
              media="(min-width:768px)"
              srcSet={"/temp/banner-collaboration-partnership2.png"}
            />
            <img
              className="w-full brightness-[70%] object-cover"
              src={"/temp/banner-collaboration-partnership2.png"}
              alt={"Collaboartion & Partnership"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#32599C] to-transparent" />
            <h1
              className="
              absolute left-[10px] bottom-[10px] 
              sm:left-[20px] sm:bottom-[20px] 
              md:left-[50px] md:bottom-[50px] 
              lg:left-[80px] lg:bottom-[80px] 
              text-white 
              text-[30px]      
              sm:text-[30px]   
              md:text-[42px]   
              lg:text-[42px]  
              font-bold capitalize"
            >
              {"Kolaborasi & Kemitraan"}
            </h1>
          </picture>
        </div>
        {/* <BannerSingleMulti data={data.banner} /> */}
      </section>

      <section className="mt-16">
        <Form />
      </section>
      <RelatedPage links={linksData} />
    </section>
  );
};

export default CollaborationPartnership;
