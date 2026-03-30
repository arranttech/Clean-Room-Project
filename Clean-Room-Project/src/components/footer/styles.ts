import theme from "../../styles/theme";

const footerDesign = {
  section: "w-full px-6 py-10 bg-[#0B1221]",
  container: "mx-auto max-w-[1200px]",
  headerWrapper: "text-center mb-10",
  title: `text-[40px] ${theme.weightBold} ${theme.trackingTight} text-white sm:text-[32px] mb-2`,
  subtitle:
    "mt-0 text-[16px] leading-relaxed text-slate-300 max-w-[900px] mx-auto",
  grid: "flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6",
  card: "flex items-center gap-2",
  iconWrapper: "flex h-5 w-5 items-center justify-center text-slate-300",
  cardTitle: `text-[14px] ${theme.weightMedium} text-white`,
  contactText: "mt-8 text-[14px] text-slate-400 text-center",
  contactLink: `${theme.weightSemibold} text-white underline decoration-slate-500 hover:text-white ${theme.transitionColors}`,
};

export default footerDesign;
