"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ContentType } from "@/types/indes";

const BusinessCarousel = ({
  bussinessList,
}: {
  bussinessList: ContentType[];
}) => {
  const [selectedItem, setSelectedItem] = useState<ContentType | null>(null);

  return (
    <>
      {/* Carousel */}
      <Carousel>
        <CarouselContent>
          {bussinessList.map((d, index) => (
            <CarouselItem
              key={index}
              className="w-full basis-1/2 md:basis-1/3 lg:basis-1/4"
              onClick={() => setSelectedItem(d)}
            >
              <div
                key={d._id}
                className="relative group rounded-2xl overflow-hidden aspect-square"
              >
                <img
                  className="w-full h-full object-cover"
                  src={d?.thumbnail_images[0]?.images[0]?.url}
                  alt={d?.title}
                />
                <div className="absolute px-4 bottom-4 text-white z-10">
                  <h2 className="font-bold text-green-light group-hover:text-white">
                    {d.title}
                  </h2>
                  <div
                    className="mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: d.description }}
                  ></div>
                </div>

                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-[rgb(0,0,0)]/[.55] from-[55%] via-black-/100 to-black/100 hover:from-green/[.85] hover:from-[25%] hover:to-black/70"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Modal */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <>
              <header className="flex items-center justify-between mt-2 mb-3">
                <section id="title">
                  <h2 className="text-lg text-green-light font-semibold">
                    {selectedItem.title}
                  </h2>
                </section>
              </header>
              <div className="md:grid md:grid-cols-2 gap-4">
                <div
                  className="pr-0 md:pr-4 basis-1 h-full max-h-[60vh] lg:max-h-[50vh] overflow-y-auto scrollbar-custom order-2 md:order-1"
                  dangerouslySetInnerHTML={{
                    __html: selectedItem.description,
                  }}
                ></div>
                <div className="w-full basis-1 order-1 md:order-2">
                  <div className="aspect-square md:aspect-auto md:h-full flex items-center justify-center">
                    <img
                      src={selectedItem?.thumbnail_images[0]?.images[0]?.url}
                      className="w-full h-auto max-h-[280px] object-cover rounded-md"
                      alt={selectedItem.title}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessCarousel;
