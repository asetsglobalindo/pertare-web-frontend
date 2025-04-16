import OutletLocatorMapClient from "@/components/OutletLocator/OutletLocatorMapClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

export const metadata: Metadata = {
  title: "Pertamina Retail - Outlet Locator",
};

const page = async () => {
  const lang = (await cookies()).get("lang")?.value || "id";

  return (
    <React.Fragment>
      <section className="xl:container mt-24">
        <h1 className="title-3 text-center max-w-[80%] text-green-light lg:w-full mx-auto">
          {lang === "en"
            ? "Find Your Nearest Pertamina Store"
            : "Temukan SPBU Pertamina Retail terdekat Anda"}
        </h1>
        <section className="mt-16">
          <OutletLocatorMapClient />
        </section>
      </section>
    </React.Fragment>
  );
};

export default page;
