"use client";

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

const SLIDE_DURATION = 5000;

const Timeline = ({
  data = [],
}: {
  data: { year: string; image: string; description: string }[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  useEffect(() => {
    if (progressRef.current) {
      const totalYears = data.length;
      
      if (activeIndex === 0) {
        // Reset progress non animated
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = "0%";
        
        // After reset, back to normal
        setTimeout(() => {
          if (progressRef.current) {
            progressRef.current.style.transition = `width ${SLIDE_DURATION}ms linear`;
            progressRef.current.style.width = `${(1 / totalYears) * 100}%`;
          }
        }, 50); // Delay to prevent flickering
      } else {
        // Normal progress update
        progressRef.current.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressRef.current.style.width = `${((activeIndex + 1) / totalYears) * 100}%`;
      }
    }
  }, [activeIndex]);

  return (
    <section className="timeline-container relative">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{ delay: SLIDE_DURATION, disableOnInteraction: false }}
        loop={true}
        onSlideChange={handleSlideChange}
        className="swiper-container"
        ref={swiperRef}
      >
        {data.length > 0 ? (
          data?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-screen">
                <img
                  src={item.image}
                  alt={item.year}
                  loading="lazy"
                  className="absolute w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                <div className="relative flex flex-col items-start h-full container mx-auto text-white pt-[90px]">
                  <h2 className="text-6xl font-normal mb-4 transition-all duration-700 opacity-100 translate-y-0">
                    {item.year}
                  </h2>
                  <div 
                    className="text-sm transition-all duration-700 delay-300 opacity-100 translate-y-0"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            </SwiperSlide>
          )) || []) : (
            <div className="text-white text-center">No data available</div>
          )}
      </Swiper>

      {/* Timeline Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-4 z-[99] w-3/4">
        <div className="relative w-full h-[2px] bg-gray-700">
          {/* Timeline Years */}
          <div
            className="flex justify-stretch mt-2 text-gray-300 text-sm relative"
            style={{ top: "-30px" }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="relative cursor-pointer flex-1 text-left"
                onMouseEnter={() => setHoveredYear(index)}
                onMouseLeave={() => setHoveredYear(null)}
                onClick={() => swiperRef.current?.swiper.slideToLoop(index)}
              >
                <div className="flex flex-col items-start transition-all duration-300">
                  <span
                    className={`transition-all duration-300 ${
                      hoveredYear === index ? "translate-y-[-120px]" : ""
                    } ${index === activeIndex ? "text-white font-bold" : ""}`}
                  >
                    {item.year}
                  </span>
                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-lg shadow-lg w-full h-[95px] transition-all duration-300 ${
                      hoveredYear === index
                        ? "opacity-100 visible translate-y-[-20px]"
                        : "opacity-0 invisible"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt="Preview"
                      loading="lazy"
                      className="w-full h-full object-cover rounded cursor-pointer"
                      onClick={() =>
                        swiperRef.current?.swiper.slideToLoop(index)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-green-light transition-all duration-300 ease-linear"
            style={{
              width: "0%",
              transition: `width ${SLIDE_DURATION}ms linear`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
