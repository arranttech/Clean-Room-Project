import theme from "../../styles/theme";

const industryDesign = {
  section: "w-full px-6 py-10 scroll-mt-20",
  container: "pt-10 mx-auto max-w-[1200px]",
  headerWrapper: "text-center mb-16",
  title: `text-[40px] ${theme.weightXBold} ${theme.trackingTight} text-[#111827] sm:text-[42px]`,
  subtitle:
    "mt-4 text-[18px] leading-relaxed text-[#4B5563] md:text-[20px] max-w-[800px] mx-auto",

  grid: "grid grid-cols-1 gap-8 md:grid-cols-3",
  card: `${theme.roundLg} border border-slate-200 bg-white p-8 ${theme.shadowSm} transition-all hover:${theme.shadowMd}`,
  iconWrapper: `mb-6 flex h-12 w-12 items-center justify-center ${theme.roundMd} text-white`,
  cardTitle: `text-[20px] ${theme.weightBold} text-[#111827]`,
  cardDesc: "mt-3 text-[16px] leading-relaxed text-[#4B5563]",
};

export default industryDesign;
