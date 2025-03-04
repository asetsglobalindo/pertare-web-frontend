import BannerSingleMulti from "@/components/BannerSingleMulti";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ApiService from "@/lib/ApiService";
import { ContentType } from "@/types/indes";
import { Metadata } from "next";
import { notFound } from "next/navigation";
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
      type: "company_report",
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

      <section className="container my-16">
        <h1 className="title-3 text-green-light text-center">{data.title}</h1>
      </section>

      <section className="bg-[#F2F2F2] py-8">
        <section className="container">
          {/* <h1 className="title-4">{data.small_text}</h1> */}
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
          <section className="mt-8 flex flex-col gap-8 lg:gap-16">
            <Carousel className="w-full ">
              <CarouselContent className="">
                {data.body
                  .filter((d) => d.type === 1)
                  .map((d, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/4 rounded-md"
                    >
                      <section className="relative group transition-all border overflow-hidden bg-white rounded-md">
                        <img
                          className="object-cover w-full rounded-md"
                          src={d?.images[0]?.images[0]?.url}
                          alt={d?.title}
                        />
                        <section className=" z-20 p-4 transition-all flex left-0 bottom-0 flex-col">
                          <h1 className="mt-2 text-lg font-semibold text-green-light ">
                            {d.title}
                          </h1>
                          <a target="_blank" href={d.button_route}>
                            <Button
                              size="default"
                              variant="outline"
                              className="w-full mt-4 text-green-light rounded-none text-xs shadow-sm group-hover:border box-border transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-light hover:text-white"
                            >
                              <span>{d.button_name} </span>
                            </Button>
                          </a>
                        </section>
                      </section>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </section>
      </section>
      <section className=" mt-8">
        <section className="container">
          {/* <h1 className="title-4 text-center">{data.bottom_button_name}</h1> */}
          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: data.small_text2 }}
          ></div>
          <section className="mt-8 flex flex-col gap-16">
            <Carousel className="w-full ">
              <CarouselContent className="">
                {data.body
                  .filter((d) => d.type === 2)
                  .map((d, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/4 bg-white rounded-md"
                    >
                      <section className="relative group transition-all border overflow-hidden rounded-md">
                        <img
                          className="object-cover w-full rounded-md"
                          src={d?.images[0]?.images[0]?.url}
                          alt={d?.title}
                        />
                        <section className=" z-20 p-4 transition-all flex left-0 bottom-0 flex-col">
                          <h1 className="mt-2 text-lg font-semibold text-green-light ">
                            {d.title}
                          </h1>
                          <a target="_blank" href={d.button_route}>
                            <Button
                              size="default"
                              variant="outline"
                              className="w-full mt-4 text-green-light rounded-none text-xs shadow-sm group-hover:border box-border transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-light hover:text-white"
                            >
                              <span>{d.button_name} </span>
                            </Button>
                          </a>
                        </section>
                      </section>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </section>
      </section>
    </section>
  );
};

export default page;
