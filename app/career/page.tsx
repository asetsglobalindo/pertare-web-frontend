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
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
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
      type: "career_page",
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

      <section className=" bg-[#F2F2F2]">
        <section className="container py-8 lg:py-16">
          <h1 className="title-3 text-green-light my-16 text-center">
            {data.title}
          </h1>
        </section>
      </section>

      <section className="mt-16 container">
        <h1 className="title-3 text-green-light text-center">
          {data.small_text}
        </h1>
        <section className="container py-16 flex flex-col gap-16">
          <Carousel className="">
            <CarouselContent className="">
              {data.body
                .filter((d) => d.type === 2)
                .map((d) => (
                  <CarouselItem key={d._id} className="w-full">
                    <section key={d._id} className=" relative">
                      <img
                        className="hidden lg:block w-[280px] rounded-3xl absolute top-1/2 -translate-y-1/2"
                        src={d?.images[0]?.images[0]?.url}
                        alt={d?.images[0]?.images[0]?.url}
                      />
                      <img
                        className="mx-auto lg:hidden w-[200px] rounded-3xl"
                        src={d?.images[0]?.images[0]?.url}
                        alt={d?.images[0]?.images[0]?.url}
                      />
                      <div className="bg-[#005CAB] lg:flex lg:h-full flex-col justify-center rounded-3xl p-8 text-white -mt-[100px] lg:-mt-0 lg:py-24 lg:pr-16 lg:pl-[calc(100px_+_64px)] lg:ml-[150px]">
                        <div
                          className="xl:text-2xl mt-[100px] lg:mt-0"
                          dangerouslySetInnerHTML={{ __html: d.text }}
                        ></div>
                        <h1 className="title-4 mt-8">{d.title}</h1>
                        <p>{d.button_name}</p>
                      </div>
                    </section>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </section>

      <section className="mt-16 container">
        <h1 className="text-center title-3 text-green-light">
          {data.small_text2}
        </h1>
        <section className="flex flex-col-reverse lg:flex-row mt-16 items-center gap-16">
          <div className="lg:w-1/2">
            <div
              className="text-xl"
              dangerouslySetInnerHTML={{ __html: data.description }}
            ></div>
            <Link href={data.bottom_button_route}>
              <Button
                rounded
                size="lg"
                className="w-fit mt-8 shadow-sm group-hover:border-white group-hover:border box-border"
              >
                <span>{data.bottom_button_name}</span>
                <ArrowRight color="white" />
              </Button>
            </Link>
          </div>
          <img
            className="lg:w-1/2"
            src={data?.images[0]?.images[0].url}
            alt={data?.title}
          />
        </section>
      </section>
    </section>
  );
};

export default page;
