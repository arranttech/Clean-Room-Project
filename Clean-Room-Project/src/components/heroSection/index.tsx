import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import constants from "../../json/constants.json";
import S from "./styles";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const imageMap: Record<string, string> = {
  slide1: "/1.jpeg",
  slide2: "/2.jpeg",
  slide3: "/3.jpeg",
  slide4: "/4.jpeg",
  slide5: "/5.jpeg",
};

const slides   = constants.hero.slides;
const ctaLabel = constants.hero.ctaLabel;

export default function HeroPage() {
  const navigate  = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className={S.section}>
      <style>{S.globalStyles}</style>

      {/* Prev arrow */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className={`${S.navBtn} ${S.navBtnPrev}`}
        aria-label="Previous slide"
      >
        <FaChevronLeft className={S.navIcon} />
      </button>

      {/* Next arrow */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className={`${S.navBtn} ${S.navBtnNext}`}
        aria-label="Next slide"
      >
        <FaChevronRight className={S.navIcon} />
      </button>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{
          clickable: true,
          renderBullet: (_index, className) =>
            `<span class="${className} hero-dot"></span>`,
        }}
        loop
        speed={700}
        className="hero-swiper"
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>

            {/* 1. Background image */}
            <div
              className={S.slideBg}
              style={{ backgroundImage: `url(${imageMap[slide.imageKey]})` }}
            />

            {/* 2. Blue tint */}
            <div className={S.slideTint} />

            {/* 3. Gradient overlay */}
            <div className={S.slideOverlay} />

            {/* 4. Content */}
            <div className={S.slideContent}>
              <div className={S.slideInner}>

                <div className={S.badge}>
                  <span className={S.badgeDot} />
                  {slide.badge}
                </div>

                <h1 className={S.title}>{slide.title}</h1>

                <p className={S.subtitle}>{slide.subtitle}</p>

                <div className={S.featuresGrid}>
                  {slide.features.map((feature) => (
                    <div key={feature} className={S.featureItem}>
                      <span className={S.featureIconWrapper}>
                        <FaCheck className={S.featureIconInner} />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={S.ctaButton} onClick={() => navigate("/login")}>
                  {ctaLabel}
                </button>

              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}