const navbarDesign = {
  // Fixed bar on top + always above page content
  header:
  "fixed top-0 left-0 right-0 z-[9999] w-full bg-white shadow-[0_8px_18px_rgba(10,20,22,0.18)]",

  // Spacing
  container: "mx-auto max-w-[1920px] px-[32px] py-[18px]",
  row: "flex items-center",

  /* LEFT */
  left: "flex items-center flex-1",

  logoWrap:
    "h-[64px] w-[64px] rounded-2xl flex items-center justify-center overflow-hidden",
  logoImg: "h-full w-full object-contain p-[8px] scale-110",

  brandBlock: "ml-[18px] flex flex-col leading-[1.1]",
  brandText: "text-[12px] font-semibold tracking-[0.28em] text-[#334155]",

  title: "ml-[36px] text-[20px] font-bold text-[#0F172A]",

  /* CENTER */
  center: "flex-1 flex justify-center gap-[64px]",
  navLink:
    "text-[18px] font-bold text-[#0F172A] hover:text-[#475569] transition-colors no-underline",

  /* RIGHT */
  right: "flex-1 flex justify-end",

  signIn:
    "text-[20px] padding-right:20px font-bold text-[#0F172A] hover:text-[#475569] transition-colors no-underline ",
}

export default navbarDesign
