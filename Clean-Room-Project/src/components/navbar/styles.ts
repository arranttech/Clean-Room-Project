const S = {
  // Fixed bar
  header:
    "fixed top-0 left-0 right-0 z-[9999] w-full bg-white shadow-[0_8px_18px_rgba(10,20,22,0.18)]",

  container: "mx-auto max-w-[1920px] px-4 md:px-8",
  row: "flex items-center justify-between h-[72px]",

  /* ── LEFT ── */
  left: "flex items-center gap-4 flex-shrink-0",

  logoWrap:
    "h-[44px] w-[44px] md:h-[56px] md:w-[56px] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0",
  logoImg: "h-full w-full object-contain p-[6px]",

  brandBlock: "hidden sm:flex flex-col leading-[1.1] flex-shrink-0",
  brandText:
    "text-blue-500 text-[10px] md:text-[12px] font-semibold tracking-[0.28em] text-[#334155] whitespace-nowrap",

  // Vertical divider between brand block and title
  leftDivider: "hidden sm:block w-px h-8 bg-slate-900 flex-shrink-0",

  title:
    "text-[16px] md:text-[20px] font-bold text-[#0F172A] whitespace-nowrap flex-shrink-0",

  /* ── CENTER — hidden on mobile ── */
  center: "hidden md:flex flex-1 justify-center gap-8 lg:gap-[64px]",
  navLink:
    "text-[15px] lg:text-[18px] font-bold text-[#0F172A] hover:text-[#475569] transition-colors no-underline whitespace-nowrap",

  /* ── RIGHT ── */
  right: "flex items-center gap-2 md:gap-3 flex-shrink-0",

  admin:
    "text-[14px] md:text-[16px] font-semibold text-white bg-[#fc8314] hover:bg-[#bf6a20] px-3 py-[6px] rounded-md transition-colors no-underline whitespace-nowrap",

  divider: "text-slate-900 select-none hidden md:block",

  signIn:
    "hidden md:block text-[16px] md:text-[20px] font-bold text-[#0F172A] hover:text-[#475569] px-2 py-2 transition-colors no-underline whitespace-nowrap",

  /* ── HAMBURGER mobile only ── */
  hamburger:
    "md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] cursor-pointer flex-shrink-0",
  hamburgerBar: "w-6 h-[2px] bg-[#0F172A] rounded-full transition-all duration-200",

  /* ── MOBILE MENU DRAWER ── */
  mobileMenu:
    "md:hidden absolute top-[72px] left-0 right-0 bg-white shadow-[0_8px_18px_rgba(10,20,22,0.12)] px-6 py-4 flex flex-col gap-4 z-[9998]",
  mobileLink:
    "text-[16px] font-bold text-[#0F172A] hover:text-[#475569] transition-colors py-2 border-b border-slate-100 last:border-0",
  mobileSignIn:
    "text-[16px] font-bold text-[#0F172A] hover:text-[#475569] transition-colors py-2",
}

export default S