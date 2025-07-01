"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
// import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import JSCookie from "js-cookie";
import { useQuery } from "react-query";
import ApiService from "@/lib/ApiService";
import { FooterType } from "@/types/indes";

const Footer = () => {
  const path = usePathname();
  const noMarginPath = ["/about/our-workers"];
  const lang = JSCookie.get("lang") || "id";

  const { data: footer } = useQuery({
    queryKey: ["header", "footer", lang],
    queryFn: async () => await getHeader(),
  });

  const getHeader = async () => {
    try {
      const response = await ApiService.get("/header/header-footer");

      if (response.data.status !== 200) {
        throw new Error(response.data.message || response.data.err);
      }

      return response.data.data?.footer as FooterType;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <footer
      className={cn(
        {
          "mt-48": !noMarginPath.includes(path),
        },
        "bg-[#171717] text-white "
      )}
    >
      <section className="container pt-16">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row md:gap-8">
            <div className="mb-6 md:mb-0 max-w-[300px] xl:max-w-[400px]">
              <a href="#" className="flex items-center mb-6 ">
                <img
                  src="/logo/logo-white.png"
                  className="max-w-[200px]"
                  alt="FlowBite Logo"
                />
              </a>
              <p>{footer?.tagline}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="min-w-fit max-w-[300px] lg:mt-8">
                <h2 className="mb-4 lg:mb-6 font-semibold text-base tracking-wide">
                  {lang === "en" ? "Link" : "Tautan"}
                </h2>
                <ul className="space-y-2">
                  {footer?.other_routes
                    .sort((a, b) => a.order - b.order)
                    .map((route) => (
                      <li key={route._id}>
                        <Link
                          href={route.route || "/"}
                          className="hover:underline"
                        >
                          {route.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="w-full lg:mt-8">
                <h2 className="mb-4 lg:mb-6 font-semibold">
                  {" "}
                  {lang === "en" ? "Contact Us" : "Hubungi Kami"}
                </h2>
                <ul className="space-y-2">
                  {footer?.address?.length ? (
                    <li>
                      <p className="flex items-start space-x-1">
                        <img src="/icons/location.svg" alt="location" />
                        <span>{footer?.address}</span>
                      </p>
                    </li>
                  ) : null}

                  {footer?.mail?.length ? (
                    <li>
                      {footer.url_mail.length ? ( //copyright_link will act as a link for tel url
                        <a
                          href={footer.url_mail}
                          className="hover:underline flex items-start space-x-1"
                        >
                          <img src="/icons/call.svg" alt="call" />
                          <span>{footer.mail}</span>
                        </a>
                      ) : (
                        <p className="flex items-start space-x-1">
                          <img src="/icons/call.svg" alt="call" />
                          <span>{footer.mail}</span>
                        </p>
                      )}
                    </li>
                  ) : null}
                  {footer?.tel?.length ? (
                    <li>
                      {footer.copyright_link.length ? ( //copyright_link will act as a link for tel url
                        <a
                          href={footer.copyright_link}
                          className="hover:underline flex items-start space-x-1"
                        >
                          <img src="/icons/call.svg" alt="call" />
                          <span>{footer.tel}</span>
                        </a>
                      ) : (
                        <p className="flex items-start space-x-1">
                          <img src="/icons/call.svg" alt="call" />
                          <span>{footer.tel}</span>
                        </p>
                      )}
                    </li>
                  ) : null}
                </ul>
              </div>
              <div
                suppressHydrationWarning
                className="max-w-[300px] min-w-fit flex flex-col items-center justify-center space-y-8 lg:mt-8"
              >
                <img
                  className="max-w-[77px]"
                  src="/icons/call-center.png"
                  alt="call-center"
                />
                <a
                  target="_blank"
                  className="rounded-full border-2 border-white/40 py-2 min-w-fit pl-2 pr-3 flex transition-all items-center gap-[6px] hover:border-white"
                  href="https://pertaminaclean.tipoffs.info/"
                >
                  <img src="/icons/pertamina-clean.svg" alt="pertamina-celan" />
                  <div>
                    <p className="text-white font-bold text-xs">
                      Whistle Blowing System
                    </p>
                    <div className="text-white font-normal text-[8px]">
                      https://pertaminaclean.tipoffs.info/
                    </div>
                  </div>
                </a>
                <Link suppressHydrationWarning href="/bazma">
                  <img
                    className="max-w-[180px]"
                    src="/logo/bazma.png"
                    alt="bazma"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="min-w-fit max-w-[300px] mt-8">
            <h2 className="mb-4 lg:mb-6 font-semibold text-base tracking-wide">
              {lang === "en" ? "Follow Us" : "Ikuti Kami"} :
            </h2>
            <ul className="flex space-x-4">
              {footer?.url_facebook?.length ? (
                <li>
                  <a
                    href={footer.url_facebook}
                    target="_blank"
                    className="hover:underline"
                  >
                    <img
                      className="w-10"
                      src="/icons/youtube.png"
                      alt="youtube"
                    />
                  </a>
                </li>
              ) : null}
              {footer?.url_instagram?.length ? (
                <li>
                  <a
                    href={footer.url_instagram}
                    target="_blank"
                    className="hover:underline"
                  >
                    <img
                      className="w-10"
                      src="/icons/instagram.png"
                      alt="instagram"
                    />
                  </a>
                </li>
              ) : null}
              {footer?.url_linkedin?.length ? (
                <li>
                  <a
                    href={footer?.url_linkedin}
                    target="_blank"
                    className="hover:underline"
                  >
                    <img
                      className="w-10"
                      src="/icons/tiktok.png"
                      alt="tiktok"
                    />
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
