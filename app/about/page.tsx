import BannerSingleMulti from "@/components/BannerSingleMulti";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ApiService from "@/lib/ApiService";
import CONTENT_TYPE from "@/lib/content-type";
import { ContentType } from "@/types/indes";
import { CircleArrowDown } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import CounterData from "./counter-data/page";
import Timeline from "./timeline/page";
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
      type: CONTENT_TYPE.ABOUT_PROFILE,
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
      href: "/about/managements",
      image: "/temp/management.png",
      alt: "Management",
      title: "Manajemen",
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

      {/* top */}
      <section className="container lg:mt-16 mt-8">
        <section className=" max-w-[900px] mx-auto">
          <h1 className="title-3 text-center text-green-light">{data.title}</h1>
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
        </section>
      </section>

      {/* vision */}
      <section className="container lg:mt-16 mt-8">
        <section className="">
          <section className="flex flex-col md:flex-row items-center bg-[#005CAB] text-white rounded-2xl overflow-hidden">
            <div className="md:w-1/2 py-8 md:py-0 max-w-[900px] mx-auto">
              <h3 className="title-3 text-center">{data.small_text2}</h3>
              <p className="text-center mt-4 px-8">{data.bottom_button_name}</p>
            </div>
            <div className="md:w-1/2">
              {data?.images?.length && (
                <img
                  className="w-full"
                  src={data?.images[0]?.images[0]?.url}
                  alt={data?.small_text2}
                />
              )}
            </div>
          </section>
        </section>
      </section>

      <section className="container lg:mt-16 mt-8">
        <section className="mx-auto">
          <section className="text-white py-8 px-8 lg:px-32 lg:pt-16 lg:pb-20 rounded-3xl overflow-hidden bg-[#005CAB]">
            <h1 className="title-3 text-center lg:mb-16">{data.sub_title1}</h1>

            <section className="grid grid-cols-1 md:grid-cols-2  gap-x-8 gap-y-8 mt-4">
              {data.body2.map((d, index) => (
                <div key={d._id} className="relative flex items-center">
                  <div className="absolute -left-5 bg-green-light rounded-lg flex items-center justify-center h-10 w-10">
                    {index + 1}
                  </div>
                  <div className="bg-white text-black pl-8 py-4 pr-4 h-full rounded-2xl flex items-center">
                    <div dangerouslySetInnerHTML={{ __html: d.text }}></div>
                  </div>
                </div>
              ))}
            </section>
          </section>
        </section>
      </section>

      {/* motto */}
      <section className="container lg:mt-16 mt-8 border-b pb-16">
        <p className="text-xl text-[#005CAB] font-bold text-center">
          {data.sub_title2}
        </p>
        <h1 className="text-3xl text-center font-bold font-Kalam mt-4">
          {data.sub_title3}
        </h1>
      </section>

      {/* timeline */}
      <Timeline
        data={data.body
          .filter((d) => d.type === 1)
          .map((d) => ({
            year: d.button_name,
            image: d?.images[0]?.images[0]?.url || "",
            description: d.text,
          }))}
      />

      <section className="container lg:mt-16 mt-8">
        <h1 className="title-3">{data.bottom_text2}</h1>
        <img
          className=" mt-4"
          src={data.thumbnail_images2[0]?.images[0]?.url}
          alt={data.bottom_text2}
        />
      </section>

      <CounterData />

      <section className="container lg:mt-16 mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="lg:w-[480px]">
          <h1 className="title-3">{data.small_text}</h1>
        </div>
        <div className="w-full">
          <Accordion type="single" collapsible className="w-full">
            {data.body
              .filter((d) => d.type === 2)
              .map((d, index) => (
                <AccordionItem key={d._id} value={"item-" + index}>
                  <AccordionTrigger className="text-green-light text-left hover:no-underline">
                    <div className="flex items-center  leading-none">
                      {d.title} <span className="px-1">|</span>{" "}
                      <a
                        className="flex items-center leading-none hover:underline"
                        href={d.button_route}
                        target="_blank"
                      >
                        <CircleArrowDown className="mr-1" size={18} />{" "}
                        {d.button_name}
                      </a>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className=""
                      dangerouslySetInnerHTML={{ __html: d.text }}
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </section>

      {/* Related Page */}
      <RelatedPage links={linksData} />
    </section>
  );
};

export default page;
