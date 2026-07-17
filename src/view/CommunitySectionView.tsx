"use client";

import { useTranslations } from "next-intl";

export default function CommunitySectionView() {
  const t = useTranslations("HomePage.community");

  return (
    <section className="px-6 sm:px-10 lg:px-[62px] pb-20 lg:pb-0 bg-gradient-to-b from-white to-[#8ECAFF]">
      <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden lg:overflow-visible">
        <div className="flex flex-col-reverse lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-20">
          {/* LEFT SIDE */}
          <div className="w-full max-w-[665px] text-left lg:text-left">
            <h2 className="w-full mt-0 lg:mt-[360px] font-[Nanum_Myeongjo] text-[32px] sm:text-[36px] lg:text-[40px] leading-[38px] sm:leading-[40px] lg:leading-[42px] font-bold">
              {t("title")}
            </h2>

            <p className="mt-6 lg:mt-[37px] w-full max-w-[522px] mx-0 lg:mx-0 h-auto font-[Nanum_Myeongjo] text-[18px] sm:text-[21px] lg:text-[24px] leading-[32px] sm:leading-[37px] lg:leading-[42px] font-semibold">
              {t("text")}
            </p>

            <div className="mt-8 lg:mt-[25px] mx-0 lg:mx-0 w-[292px] h-[69px] rounded-[30px] bg-gradient-to-r from-[#3290E5] to-[#1C507F] p-[2px] shadow-[0px_10px_10px_0px_#B1D6F8]">
              <button className="w-[288px] h-[65px] rounded-[28px] bg-white px-[37px] py-[15px] font-[Nanum_Myeongjo] text-[20px] leading-[20px] font-bold">
                {t("button")}
              </button>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="lg:mt-[460px] mt-[150px] lg:mr-[100px] relative shrink-0">
            <img
              src={"/herosection.svg"}
              alt=""
              className="w-[320px] sm:w-[470px] lg:w-[600px] h-auto shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}