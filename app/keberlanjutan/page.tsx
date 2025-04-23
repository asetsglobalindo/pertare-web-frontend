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
      type: CONTENT_TYPE.CSR,
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

const page = async () => {
  const data: ContentType = await getData();
  const dataOurPrograms: any = await getDataBannerOurPrograms();
  const linksData = [
    {
      href: "/keberlanjutan/our-programs",
      image: dataOurPrograms.data.id.banner[0].id.images[0].url,
      alt: "Program Kami",
      title: dataOurPrograms.data.id.page_title,
    },
    {
      href: "/keberlanjutan/collaboration-partnership",
      image: "/temp/banner-collaboration-partnership.png",
      alt: "Kolaborasi & Kemitraan",
      title: "Kolaborasi & Kemitraan",
    },
  ];

  return (
    <section>
      <section className="relative">
        <BannerSingleMulti data={data.banner} />
      </section>

      {/* Section Direksi  */}
      <section className="container mt-16">
        <h1 className="mb-8 text-center text-5xl font-bold">
          <span className="text-black">Komitmen Keberlanjutan</span>
        </h1>
        <section className="flex flex-col sm:flex-row items-center gap-8 w-full">
          {/* Card Image */}
          <div className="bg-[#9CA9B1] relative h-[340px] rounded-2xl p-6 flex-shrink-0 w-full sm:w-1/3 flex flex-col items-start justify-end">
            <img
              src="/temp/zibali2.jpeg"
              alt="Zibali Hisbul Masih"
              className="absolute inset-0 w-full h-full rounded-lg object-cover object-left-top"
            />
            <div className="text-white text-left mt-4 relative z-[1]">
              <h3 className="font-bold text-lg relative inline-block pb-1 border-b border-white">
                <span className="text-white">Zibali Hisbul Masih</span>
              </h3>
              <p className="text-sm mt-[8px]">
                Direktur Utama PT Pertamina Retail
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full sm:w-2/3">
            <blockquote className="text-gray-600 text-lg">
              “Sebagai bagian dari subholding C&T keluarga besar Pertamina, kami
              berkomitmen untuk mendukung pencapaian Sustainable Development
              Goals (SDGs) melalui integrasi prinsip Environmental, Social, dan
              Governance (ESG). Dalam upaya mencapai Net Zero Emission 2060,
              kami terus mengembangkan inisiatif energi bersih dan ramah
              lingkungan yang sejalan dengan transisi energi berkelanjutan.
              <br />
              <br />
              Serta melalui pilar-pilar CSR, seperti pemberdayaan komunitas,
              pendidikan, pelestarian lingkungan, serta kesehatan dan
              keselamatan, kami percaya bahwa tanggung jawab sosial harus
              memberikan dampak nyata. Dengan ber-SINERGI, kami optimis dapat
              menghadirkan perubahan positif bagi masyarakat dan lingkungan,
              demi masa depan yang lebih hijau dan inklusif.”
            </blockquote>
          </div>
        </section>
      </section>

      <section className="container mt-16">
        <section className=" mx-auto">
          <section
            className="text-white  py-16 px-4 lg:px-14 bg-cover bg-center bg-[length:200%] bg-no-repeat rounded-2xl overflow-hidden flex flex-col items-center"
            style={{
              backgroundImage: `url(${data?.thumbnail_images[0]?.images[0]?.url})`,
            }}
          >
            <h1 className="title-3 text-center">
              <span className="text-white">{data.sub_title1}</span>
            </h1>
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: data.bottom_button_name }}
            ></div>
          </section>
        </section>
      </section>

      <section className="container lg:mt-16 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.body
          .filter((d) => d.type === 3)
          .map((d) => (
            <div
              className="relative rounded-2xl overflow-hidden group"
              key={d._id}
            >
              <img
                className="w-full h-full object-cover aspect-square transition-transform duration-500 ease-in-out group-hover:scale-110"
                src={d?.images[0]?.images[0]?.url}
                alt={d?.title}
              />
              <div className="absolute inset-0 transition-opacity duration-500"></div>

              <section className="absolute bg-black bg-opacity-50 h-full bottom-0 z-20 left-0 p-4 transition-all flex flex-col items-start w-full justify-end gap-2">
                <h2 className="mt-2 text-xl text-green-light font-semibold lg:max-w-[70%] ">
                  {d.title}
                </h2>
                <div
                  className="text-white"
                  dangerouslySetInnerHTML={{ __html: d.text }}
                ></div>
              </section>
            </div>
          ))}
      </section>

      <section className="container lg:mt-16 mt-8">
        <section
          className="dont-reset"
          dangerouslySetInnerHTML={{ __html: data.sub_title2 }}
        ></section>
        <img
          className="w-full lg:mt-16 mt-8"
          src={data?.images[0]?.images[0]?.url}
          alt=""
        />
      </section>

      <section className="container">
        <section className=" px-0 rounded-2xl flex-col md:flex-row overflow-hidden md:mt-16 mt-8 bg-[#005CAB] flex items-center">
          <section className="md:w-5/12 overflow-hidden">
            <img
              className="h-full md:min-h-[300px] lg:min-h-[400px]  object-cover scale-105"
              src={data?.images2[0]?.images[0]?.url}
              alt=""
            />
          </section>
          <section
            className="px-4 lg:px-12 py-6 md:w-7/12"
            dangerouslySetInnerHTML={{ __html: data.sub_title3 }}
          ></section>
        </section>
      </section>

      <section className="container lg:mt-16 mt-8">
        <section
          className=""
          dangerouslySetInnerHTML={{
            __html: data.small_text.replace(
              /<p(.*?)>/g,
              '<p class="w-full lg:w-[60%] mx-auto"$1>'
            ),
          }}
        ></section>
      </section>

      <section className="container mt-8">
        <section className="mx-auto">
          <section
            className="text-white min-h-[400px] flex items-center py-[50px] px-8 lg:px-14 bg-cover bg-no-repeat rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(${data?.thumbnail_images2[0]?.images[0]?.url})`,
            }}
          >
            <section className="grid grid-cols-1 md:grid-cols-2  gap-x-[100px] gap-y-8">
              {data.body
                .filter((d) => d.type === 2)
                .map((d, index) => (
                  <div
                    key={d._id}
                    className="relative flex items-center xl:aspect-[4/1]"
                  >
                    <div className="absolute -left-[28px] bg-green-light rounded-lg flex flex-col items-center justify-center h-[50px] w-[50px] ">
                      <span className="text-3xl font-bold h-[29px]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="bg-white text-black pl-8 py-4 pr-4 lg:h-[150px] md:h-full sm:h-full h-full rounded-2xl flex flex-col gap-2">
                      <h3 className="text-[20px] text-green-light text-left">
                        {d.title}
                      </h3>
                      <div
                        className="text-black-400"
                        dangerouslySetInnerHTML={{ __html: d.text }}
                      ></div>
                    </div>
                  </div>
                ))}
            </section>
          </section>
        </section>
      </section>

      {/* Related Page */}
      <RelatedPage links={linksData} />
    </section>
  );
};

export default page;
