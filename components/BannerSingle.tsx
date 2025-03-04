"use client";
import uiStore from "@/app/store/uiStore";
import { ImageType } from "@/types/indes";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const BannerSingle: React.FC<{ data: ImageType[]; lang: string }> = ({
  data,
  lang,
}) => {
  const ui = uiStore((state) => state);
  const { ref, inView } = useInView({ threshold: 0 });
  const pathname = usePathname();
  const { t } = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ui.setHeaderColor(inView ? "white" : "black");
  }, [inView]);

  if (!data?.length) {
    return null;
  }

  // Mapping title berdasarkan bahasa
  const titleMapping: Record<string, Record<string, string>> = {
    about: {
      id: "Profil",
      en: "Profile",
    },
    csr: {
      id: "Tanggung Jawab Sosial",
      en: "Corporate Social Responsibility",
    },
    "our-values": {
      id: "Tata Nilai",
      en: "Our Values",
    },
    awards: {
      id: "Penghargaan",
      en: "Awards",
    },
    managements: {
      id: "Manajemen",
      en: "Management",
    },
    "our-programs": {
      id: "Program Kami",
      en: "Our Programs",
    },
    partnership: {
      id: "Kerjasama",
      en: "Partnership",
    },
    news: {
      id: "Berita",
      en: "News",
    },
    career: {
      id: "Karir",
      en: "Career",
    },
    "bahan-bakar": {
      id: "Bahan Bakar",
      en: "Fuel",
    },
    "non-bahan-bakar": {
      id: "Non Bahan Bakar",
      en: "Non Fuel",
    },
    "company-report": {
      id: "Laporan Perusahaan",
      en: "Company Report",
    },
    "procurement-informations": {
      id: "Informasi Pengadaan",
      en: "Procurement Informations",
    },
    "collaboration-partnership": {
      id: "Kolaborasi & Kemitraan",
      en: "Collaboration & Partnership",
    },
  };

  const rawTitle = pathname?.split("/").filter(Boolean).pop() || "Home";
  const normalizedTitle = rawTitle.toLowerCase();

  const mappedTitle = titleMapping[normalizedTitle]?.[lang] || rawTitle;

  const translatedTitle = t(mappedTitle.replace(/-/g, " "));

  return (
    <div ref={ref} className="relative w-full">
      {data.slice(0, 1).map((img) => (
        <picture key={img._id} className="relative w-full">
          <source media="(min-width:768px)" srcSet={img?.images[0]?.url} />
          <img
            className="w-full brightness-[70%] object-cover"
            src={img?.images_mobile[0]?.url}
            alt={translatedTitle}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#32599C] to-transparent" />
          <h1
            className="
              absolute left-[10px] bottom-[10px] 
              sm:left-[20px] sm:bottom-[10px] 
              md:left-[50px] md:bottom-[50px] 
              lg:left-[100px] lg:bottom-[120px] 
              text-white 
              text-[30px]      
              sm:text-[30px]   
              md:text-[42px]   
              lg:text-[42px]  
              font-bold capitalize"
          >
            {translatedTitle}
          </h1>
        </picture>
      ))}
    </div>
  );
};

export default BannerSingle;
