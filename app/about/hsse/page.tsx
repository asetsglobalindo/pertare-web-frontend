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
      type: CONTENT_TYPE.ABOUT_HSS,
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
        <Accordion
          type="multiple"
          defaultValue={data.body.map((_, index) => `item-${index}`)}
          className="w-full flex flex-col gap-8 mt-16"
        >
          {data.body.map((data, index) => (
            <AccordionItem
              className="border-2 border-green-light px-8 rounded-2xl"
              key={data._id}
              value={"item-" + index}
            >
              <AccordionTrigger className="outline-none">
                <div className="flex items-center gap-4">
                  <img src={data?.images[0]?.images[0]?.url} alt={data.title} />
                  <span className="inline-block font-bold md:text-lg">
                    {data.title}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="border-t pt-4"
                  dangerouslySetInnerHTML={{ __html: data.text }}
                ></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </section>
  );
};

export default page;
