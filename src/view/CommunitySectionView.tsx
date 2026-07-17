"use client";

import { useTranslations } from "next-intl";

export default function CommunitySectionView() {
  const t = useTranslations("HomePage.community");

  return (
    <section className="bg-community-gradient px-6 pb-20 text-black sm:px-10 lg:px-[62px] lg:pb-0">
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden lg:overflow-visible">
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:items-start lg:gap-20">
          {/* LEFT SIDE */}
          <div className="w-full max-w-[665px] text-left text-black">
            <h2 className="mt-0 w-full font-[Nanum_Myeongjo] text-[32px] font-bold leading-[38px] text-black sm:text-[36px] sm:leading-[40px] lg:mt-[360px] lg:text-[40px] lg:leading-[42px]">
              {t("title")}
            </h2>

            <p className="mx-0 mt-6 h-auto w-full max-w-[522px] font-[Nanum_Myeongjo] text-[18px] leading-[32px] text-black sm:text-[21px] sm:leading-[37px] lg:mt-[37px] lg:text-[24px] lg:leading-[42px]">
              {t("text")}
            </p>

            <div className="mx-0 mt-8 h-[69px] w-[292px] rounded-[30px] bg-gradient-to-r from-[#3290E5] to-[#1C507F] p-[2px] lg:mt-[25px]">
              <button className="h-[65px] w-[288px] rounded-[28px] bg-white px-[37px] py-[15px] font-[Nanum_Myeongjo] text-[20px] font-bold leading-[20px] text-black">
                {t("button")}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative mt-[150px] shrink-0 lg:mr-[100px] lg:mt-[460px]">
            <img
              src="/herosection.svg"
              alt=""
              className="h-auto w-[320px] shrink-0 sm:w-[470px] lg:w-[600px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}