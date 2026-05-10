"use client";

import { useTranslations } from "next-intl";
import Image from 'next/image';
import HeroPattern from "public/hero-pattern.svg"
export default function CommunitySectionView() {
    const t = useTranslations("HomePage.community");
    
  return (
    <section className="px-[62px] bg-gradient-to-b from-white to-[#8ECAFF]">
      <div className="relative max-w-6xl overflow-visible">
        <div className="flex">
          {/* LEFT SIDE */}
          <div className="w-fit">
            <h2 className="mt-[360px] w-[665px] font-[Nanum_Myeongjo] text-[40px] leading-[42px] font-bold tracking-[0]">
              {t("title")}
            </h2>
            <p className="mt-[37px] w-[522px] h-[462px] font-[Nanum_Myeongjo] text-[24px] leading-[42px] font-semibold tracking-[0]">
              {t("text")}
            </p>
            <div className="mt-[25px] w-[292px] h-[69px] rounded-[30px] bg-gradient-to-r from-[#3290E5] to-[#1C507F] p-[2px] shadow-[0px_10px_10px_0px_#B1D6F8]">
              <button className=" bg-white px-[37px] py-[15px] w-[288px] h-[65px] rounded-[28px] font-[Nanum_Myeongjo] text-[20px] leading-[20px] font-bold tracking-[0]"> 
                {t("button")}
              </button>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="relative flex justify-center w-[500px] h-[700px]">
            <img
              src="/rectangle.png"
              alt="rectangle"
              className="absolute top-[402px] left-[-118px] z-[100]"
            />
            <img
              src="/rectangle2.png"
              alt="rectangle"
              className="absolute top-[574px] left-[93px] z-[100]"
            />
            <img
              src="/hero-pattern.svg"
              alt=""
              className="absolute top-[350px] left-[75px] w-[339px] h-[400px] z-[90]"
            />
            <img
              src="/darkone.png"
              alt=""
              className="absolute top-[478px] left-[204px] w-[339px] h-[400px] z-[80]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}