const S = {
  globalStyles: `
    .hero-swiper,
    .hero-swiper .swiper-wrapper,
    .hero-swiper .swiper-slide { height: 420px !important; }

    @media (min-width: 640px) {
      .hero-swiper,
      .hero-swiper .swiper-wrapper,
      .hero-swiper .swiper-slide { height: 500px !important; }
    }
    @media (min-width: 768px) {
      .hero-swiper,
      .hero-swiper .swiper-wrapper,
      .hero-swiper .swiper-slide { height: 580px !important; }
    }
    @media (min-width: 1024px) {
      .hero-swiper,
      .hero-swiper .swiper-wrapper,
      .hero-swiper .swiper-slide { height: 640px !important; }
    }

    .swiper-pagination { bottom: 16px !important; }
    .hero-dot {
      display: inline-block;
      height: 7px; width: 7px;
      border-radius: 9999px;
      background: rgba(255,255,255,0.35);
      transition: all 0.35s ease;
      cursor: pointer;
      margin: 0 3px !important;
    }
    .swiper-pagination-bullet-active.hero-dot {
      background: white;
      width: 28px;
    }
  `,
  section: "relative w-full h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] overflow-hidden",
  navBtn:
    "absolute top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/25 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 cursor-pointer",
  navBtnPrev: "left-2 md:left-4",
  navBtnNext: "right-2 md:right-4",
  navIcon: "text-[11px] md:text-[13px]",
  slideBg: "absolute inset-0 bg-cover bg-center bg-no-repeat z-0",
  slideTint: "absolute inset-0 z-[1] bg-[#081437]/40",
  slideOverlay:
    "absolute inset-0 z-[2] bg-gradient-to-r from-[#0c1a2e]/95 via-[#0c1a2e]/75 to-[#0c1a2e]/30 md:from-[#0c1a2e]/90 md:via-[#0c1a2e]/65 md:to-[#0c1a2e]/20",
  slideContent: "pl-20 relative z-10 h-full flex items-center justify-start",
  slideInner: "w-full px-6 sm:px-10 md:px-16 lg:px-24 max-w-[860px]",
  badge:
    "inline-flex items-center gap-[8px] rounded-full bg-[#7c4a1e]/70 border border-[#c07a3a]/50 px-[12px] sm:px-[16px] py-[5px] sm:py-[8px] text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-[#fc8314] mb-[10px] sm:mb-[14px] md:mb-[20px]",
  badgeDot:
    "w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full bg-[#d47a2e] flex-shrink-0",
  title:
    "text-[22px] sm:text-[30px] md:text-[38px] lg:text-[42px] font-extrabold leading-[1.15] tracking-tight text-white mb-[8px] sm:mb-[12px] md:mb-[18px] max-w-[680px]",
  subtitle:
    "text-[12px] sm:text-[14px] md:text-[16px] text-white/80 leading-[1.6] mb-[14px] sm:mb-[20px] md:mb-[28px] max-w-[560px]",
  featuresGrid:
    "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-[6px] sm:gap-y-[10px] md:gap-y-[12px] mb-[18px] sm:mb-[26px] md:mb-[36px] max-w-[500px]",
  featureItem:
    "flex items-center gap-[8px] text-[12px] sm:text-[13px] md:text-[14px] font-normal text-white/85",
  featureIconWrapper:
    "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] rounded-full border-[1.5px] border-[#d47a2e] flex items-center justify-center flex-shrink-0",
  featureIconInner: "text-[#d47a2e] text-[7px] sm:text-[8px] md:text-[9px]",
  ctaButton:
    "inline-flex items-center justify-center rounded-[8px] md:rounded-[10px] bg-[#fc8314] hover:bg-[#bf6a20] active:bg-[#a85c18] text-white font-bold text-[13px] sm:text-[14px] md:text-[16px] px-[20px] sm:px-[28px] md:px-[36px] py-[9px] sm:py-[11px] md:py-[13px] transition-colors duration-200 shadow-[0_4px_18px_rgba(212,122,46,0.35)] cursor-pointer",
}

export default S