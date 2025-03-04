"use client";
import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import uiStore from "@/app/store/uiStore";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useQuery } from "react-query";
import ApiService from "@/lib/ApiService";
import { HeaderItemChild, HeaderItemType } from "@/types/indes";
import JSCookie from "js-cookie";
import { UpdateLangPreference } from "@/app/action";
import { usePathname } from "next/navigation";

const langOptions = [
  { label: "en", value: "en" },
  { label: "id", value: "id" },
];

const NavItem: React.FC<{
  data: HeaderItemChild;
  color?: string;
  side?: "left" | "right" | "bottom" | "top";
}> = ({ data, side = "bottom", color }) => {
  const ui = uiStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // for non sub routes
  if (!data.childs.length) {
    return (
      <Link href={data.route}>
        {data.name.toLowerCase() === "home" ||
        data.name.toLowerCase() === "beranda" ? (
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7281 0.953614C11.377 0.680505 10.9449 0.532227 10.5001 0.532227C10.0553 0.532227 9.62319 0.680505 9.2721 0.953614L0.888104 7.47361C0.136104 8.06061 0.550104 9.26561 1.5031 9.26561H2.5001V17.2656C2.5001 17.796 2.71082 18.3048 3.08589 18.6798C3.46096 19.0549 3.96967 19.2656 4.5001 19.2656H8.5001V13.2656C8.5001 12.7352 8.71082 12.2265 9.08589 11.8514C9.46096 11.4763 9.96967 11.2656 10.5001 11.2656C11.0305 11.2656 11.5392 11.4763 11.9143 11.8514C12.2894 12.2265 12.5001 12.7352 12.5001 13.2656V19.2656H16.5001C17.0305 19.2656 17.5392 19.0549 17.9143 18.6798C18.2894 18.3048 18.5001 17.796 18.5001 17.2656V9.26561H19.4971C20.4491 9.26561 20.8651 8.06061 20.1121 7.47461L11.7281 0.953614Z"
              fill={ui.headerColor}
            />
          </svg>
        ) : (
          data.name
        )}
      </Link>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center space-x-1">
        <span className="inline-block leading-none">{data.name}</span>
        <svg
          className={cn(
            {
              "rotate-180": isOpen && side === "bottom",
              "rotate-[-90deg]": side === "right",
            },
            "w-4 transition-all"
          )}
          width="9"
          height="5"
          viewBox="0 0 9 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.70665 0.430832H4.33207H1.29332C0.773319 0.430832 0.513319 1.05917 0.881653 1.4275L3.68749 4.23333C4.13707 4.68291 4.86832 4.68291 5.3179 4.23333L6.38499 3.16625L8.12374 1.4275C8.48665 1.05917 8.22665 0.430832 7.70665 0.430832Z"
            fill={color || ui.headerColor}
          />
        </svg>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        className=" min-w-28 relative flex  z-[99999] w-64"
        sideOffset={20}
        align="start"
      >
        {/* <div className={cn({" -top-6": side === "bottom"}, "absolute")}>
          <div className="rotate-180">
            <svg width="40" height="40" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.4332 4.43083H7.05863H4.01988C3.49988 4.43083 3.23988 5.05917 3.60822 5.4275L6.41405 8.23333C6.86363 8.68291 7.59488 8.68291 8.04447 8.23333L9.11155 7.16625L10.8503 5.4275C11.2132 5.05917 10.9532 4.43083 10.4332 4.43083Z"
                fill="white"
              />
            </svg>
          </div>
        </div> */}
        <section className="flex flex-col w-full space-y-1">
          {data.childs.map((route) => (
            <div key={route.name}>
              {route?.childs?.length ? (
                <React.Fragment>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem className="border-none" value="item-1">
                      <AccordionTrigger className="w-full no-underline hover:no-underline leading-none font-normal text-sm rounded-md hover:bg-green-light/40 px-2 py-1">
                        {route.name}
                      </AccordionTrigger>
                      <AccordionContent className="pb-0 ml-4 mt-1">
                        {route.childs.map((item, index) => (
                          <Link
                            key={item.name + index}
                            className="w-full block hover:bg-green-light/40 px-2 py-1 rounded-md"
                            href={item.route}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {/* <NavItem data={route} side="right" color="black" /> */}
                </React.Fragment>
              ) : (
                <Link
                  className="w-full block hover:bg-green-light/40 px-2 py-1 rounded-md"
                  href={route.route}
                >
                  {route.name}
                </Link>
              )}
            </div>
          ))}
        </section>
      </PopoverContent>
    </Popover>
  );
};

const NavItemMobile: React.FC<{ data: HeaderItemChild; index: number }> = ({
  data,
  index,
}) => {
  return (
    <AccordionItem
      value={`route-${index}`}
      key={`${data.name}-${index}`}
      className="nav-mobile-accordion-item"
    >
      <AccordionTrigger className="text-center flex justify-center flex-none mx-auto relative">
        {data.childs?.length ? (
          <div className="w-fit flex justify-center items-center relative">
            <span className="text-center ">{data.name}</span>
          </div>
        ) : (
          <Link href={data.route} className="w-full">
            {data.name}
          </Link>
        )}

        {data.childs?.length ? (
          <svg
            className={"w-4 transition-all absolute  -right-5"}
            width="9"
            height="5"
            viewBox="0 0 9 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.70665 0.430832H4.33207H1.29332C0.773319 0.430832 0.513319 1.05917 0.881653 1.4275L3.68749 4.23333C4.13707 4.68291 4.86832 4.68291 5.3179 4.23333L6.38499 3.16625L8.12374 1.4275C8.48665 1.05917 8.22665 0.430832 7.70665 0.430832Z"
              fill="black"
            />
          </svg>
        ) : null}
      </AccordionTrigger>
      <AccordionContent>
        <section className="flex flex-col space-y-4 text-center">
          {data.childs?.map((route) => (
            <section
              key={route.name}
              className="flex flex-col space-y-4 text-center"
            >
              {route.childs.length ? (
                route.childs.map((child) => (
                  <Link
                    className="hover:text-green-light hover:underline"
                    key={child.name}
                    href={child.route}
                  >
                    {child.name}
                  </Link>
                ))
              ) : (
                <Link
                  className="hover:text-green-light hover:underline"
                  href={route.route}
                >
                  {route.name}
                </Link>
              )}
            </section>
          ))}
        </section>
      </AccordionContent>
    </AccordionItem>
  );
};

const LanguageSwitcher = () => {
  const ui = uiStore((state) => state);
  const lang = JSCookie.get("lang") || "id";
  const [isOpen, setIsOpen] = useState(false);

  const updateLang = (lang: string) => {
    UpdateLangPreference(lang);
  };

  return (
    <li className="flex">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="flex items-center space-x-1">
          <svg
            className="-mt-1"
            width="16"
            height="16"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.7734 21C9.32833 21 7.96722 20.7239 6.69011 20.1717C5.413 19.6187 4.30078 18.8681 3.35344 17.92C2.40611 16.9719 1.65555 15.8597 1.10178 14.5833C0.548 13.307 0.271888 11.9459 0.273444 10.5C0.273444 9.05022 0.549555 7.68794 1.10178 6.41316C1.65478 5.13761 2.40533 4.02655 3.35344 3.08C4.30155 2.13344 5.41378 1.38289 6.69011 0.828333C7.96722 0.276111 9.32833 0 10.7734 0C12.2232 0 13.5855 0.276111 14.8603 0.828333C16.1358 1.38133 17.2473 2.13189 18.1946 3.08C19.1419 4.02811 19.8921 5.13916 20.4451 6.41316C20.9973 7.68872 21.2734 9.051 21.2734 10.5C21.2734 11.9451 20.9973 13.3062 20.4451 14.5833C19.8921 15.8604 19.1416 16.9727 18.1934 17.92C17.2453 18.8673 16.1343 19.6179 14.8603 20.1717C13.5863 20.7254 12.224 21.0015 10.7734 21ZM10.7734 19.8427C11.4579 18.963 12.0226 18.0993 12.4674 17.2515C12.9116 16.4037 13.2728 15.4548 13.5513 14.4048H7.99561C8.30439 15.5139 8.67305 16.4924 9.10161 17.3402C9.53094 18.1879 10.0882 19.0221 10.7734 19.8427ZM9.28827 19.6677C8.74383 19.026 8.24683 18.2327 7.79728 17.2877C7.34772 16.3434 7.01327 15.3821 6.79394 14.4037H2.31978C2.98867 15.8542 3.93639 17.0442 5.16294 17.9737C6.39028 18.9023 7.76539 19.467 9.28827 19.6677ZM12.2586 19.6677C13.7815 19.467 15.1566 18.9023 16.3839 17.9737C17.6105 17.0442 18.5582 15.8542 19.2271 14.4037H14.7541C14.4586 15.3969 14.0864 16.3656 13.6376 17.3098C13.1881 18.2548 12.7284 19.0415 12.2586 19.6677ZM1.84378 13.2382H6.55127C6.46261 12.7591 6.40039 12.2924 6.36461 11.8382C6.32727 11.3847 6.30861 10.9387 6.30861 10.5C6.30861 10.0613 6.32689 9.61527 6.36344 9.16183C6.4 8.70839 6.46222 8.24172 6.55011 7.76183H1.84494C1.71817 8.16628 1.619 8.60689 1.54744 9.08366C1.47589 9.55966 1.44011 10.0318 1.44011 10.5C1.44011 10.9682 1.4755 11.4407 1.54628 11.9175C1.61705 12.3943 1.71622 12.8341 1.84378 13.237M7.71794 13.237H13.8289C13.9176 12.7587 13.9798 12.2998 14.0156 11.8603C14.0529 11.4217 14.0716 10.9682 14.0716 10.5C14.0716 10.0318 14.0533 9.57833 14.0168 9.13966C13.9802 8.701 13.918 8.24211 13.8301 7.763H7.71677C7.62889 8.24133 7.56666 8.70022 7.53011 9.13966C7.49355 9.57833 7.47528 10.0318 7.47528 10.5C7.47528 10.9682 7.49355 11.4217 7.53011 11.8603C7.56666 12.299 7.63005 12.7579 7.71794 13.237ZM14.9968 13.237H19.7031C19.8299 12.8333 19.929 12.3935 20.0006 11.9175C20.0714 11.4407 20.1068 10.9682 20.1068 10.5C20.1068 10.0318 20.0714 9.55927 20.0006 9.0825C19.9298 8.60572 19.8307 8.16589 19.7031 7.763H14.9956C15.0843 8.24133 15.1465 8.70761 15.1823 9.16183C15.2196 9.61605 15.2383 10.0621 15.2383 10.5C15.2383 10.9379 15.22 11.3839 15.1834 11.8382C15.1469 12.2924 15.0847 12.7591 14.9968 13.2382M14.7541 6.59633H19.2271C18.5434 5.11544 17.607 3.92544 16.4178 3.02633C15.2285 2.12722 13.8422 1.55517 12.2586 1.31017C12.8031 2.0265 13.2927 2.84589 13.7274 3.76833C14.1622 4.69 14.5044 5.63267 14.7541 6.59633ZM7.99561 6.59633H13.5513C13.2433 5.50122 12.8633 4.51111 12.4114 3.626C11.9596 2.74089 11.4136 1.918 10.7734 1.15733C10.1333 1.91722 9.58733 2.74011 9.13544 3.626C8.68355 4.51189 8.30283 5.502 7.99561 6.59633ZM2.32094 6.59633H6.79394C7.04361 5.63344 7.38583 4.69078 7.82061 3.76833C8.25539 2.84589 8.745 2.0265 9.28944 1.31017C7.69189 1.55594 6.302 2.1315 5.11978 3.03683C3.93755 3.94372 3.00422 5.12983 2.31978 6.59516"
              fill={ui.headerColor}
            />
          </svg>
          {lang ? (
            <span className="inline-block uppercase leading-none">{lang}</span>
          ) : null}
          <svg
            className={cn({ "rotate-180": isOpen }, "w-4 transition-all")}
            width="9"
            height="5"
            viewBox="0 0 9 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.70665 0.430832H4.33207H1.29332C0.773319 0.430832 0.513319 1.05917 0.881653 1.4275L3.68749 4.23333C4.13707 4.68291 4.86832 4.68291 5.3179 4.23333L6.38499 3.16625L8.12374 1.4275C8.48665 1.05917 8.22665 0.430832 7.70665 0.430832Z"
              fill={ui.headerColor}
            />
          </svg>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          className="w-fit min-w-28 relative flex justify-center z-[99999]"
          sideOffset={20}
        >
          <div className="absolute -top-6">
            <div className="rotate-180">
              <svg
                width="40"
                height="40"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4332 4.43083H7.05863H4.01988C3.49988 4.43083 3.23988 5.05917 3.60822 5.4275L6.41405 8.23333C6.86363 8.68291 7.59488 8.68291 8.04447 8.23333L9.11155 7.16625L10.8503 5.4275C11.2132 5.05917 10.9532 4.43083 10.4332 4.43083Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <section className="flex flex-col w-fit space-y-2">
            {langOptions.map((lang) => (
              <button
                key={lang.value}
                onClick={() => updateLang(lang.value)}
                className="hover:text-green-light hover:underline uppercase"
              >
                {lang.value}
              </button>
            ))}
          </section>
        </PopoverContent>
      </Popover>
    </li>
  );
};

const Header = () => {
  const lang = JSCookie.get("lang") || "id";
  const ui = uiStore((state) => state);
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: header } = useQuery({
    queryKey: ["header", lang],
    queryFn: async () => await getHeader(),
  });

  const getHeader = async () => {
    try {
      const response = await ApiService.get("/header/header-footer");

      if (response.data.status !== 200) {
        throw new Error(response.data.message || response.data.err);
      }

      return (response.data.data?.headers || []) as HeaderItemType[] | [];
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ui.setHeaderColor("black");
    setIsOpen(false);
  }, [path]);

  return (
    <React.Fragment>
      <header
        className={cn(
          {
            "text-white border-white/40": ui.headerColor === "white",
            "text-black border-black/40 bg-white": ui.headerColor === "black",
          },
          "h-20 fixed top-0 w-full pt-4 z-50  border-b pb-4"
        )}
      >
        <section className="container ">
          <section
            className={cn(
              {},
              "items-center flex justify-between relative w-full "
            )}
          >
            <nav className="w-full hidden xl:block">
              <ul className="flex w-full space-x-8 items-center mt-4">
                {header?.map((route) => (
                  <li key={route.name} className="flex leading-none">
                    <NavItem data={route} />
                  </li>
                ))}

                <LanguageSwitcher />
              </ul>
            </nav>

            <Link href="/">
              <img
                className="w-40"
                src={
                  ui.headerColor === "white"
                    ? "/logo/logo-white.png"
                    : "/logo/logo.png"
                }
                alt="pertamina-retail-logo"
              />
            </Link>

            <Drawer
              open={isOpen}
              onOpenChange={setIsOpen}
              direction="right"
              handleOnly
            >
              <DrawerTrigger
                onClick={() => setIsOpen(true)}
                className="xl:hidden"
              >
                <svg
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.41602 12.4166H16.5827M1.41602 6.99992H16.5827M1.41602 1.58325H16.5827"
                    stroke={ui.headerColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </DrawerTrigger>
              <DrawerContent className="h-full rounded-none p-6">
                {/* required by compoenent */}
                <DrawerTitle className="hidden">Nav Mobile</DrawerTitle>

                {/* close */}
                <section className="flex justify-between items-center">
                  <img className="w-40" src={"/logo/logo.png"} alt="close" />
                  <DrawerClose>
                    <X />
                  </DrawerClose>
                </section>

                {/* actual navigation */}
                <Accordion className="mt-16" type="single" collapsible>
                  {header?.map((route, index) => (
                    <NavItemMobile key={route._id} index={index} data={route} />
                  ))}
                </Accordion>
              </DrawerContent>
            </Drawer>
          </section>
        </section>
      </header>

      {/* header spacer */}
      {ui.headerColor === "black" ? <div className="h-20 w-full" /> : null}
    </React.Fragment>
  );
};

export default Header;
