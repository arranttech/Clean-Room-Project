import theme from "../../styles/theme";

const industryDesign = {
  section: `w-full px-6 py-10 scroll-mt-20`,
  container: `pt-10 mx-auto max-w-screen-2xl`,
  headerWrapper: `text-center mb-16`,
  title: `text-[40px] ${theme.weightXBold} ${theme.trackingTight} text-${theme.textPrimary} sm:text-[42px]`,
  subtitle:
    `mt-4 text-[18px] leading-relaxed text-${theme.textSecondary} md:text-[20px] max-w-[800px] mx-auto`,

  grid: `grid grid-cols-1 gap-8 md:grid-cols-3`,
  card: `${theme.roundLg} border border-${theme.borderColor} bg-white p-8 ${theme.shadowSm} transition-all hover:${theme.shadowMd}`,
  iconWrapper: `mb-6 flex h-12 w-12 items-center justify-center ${theme.roundMd} text-white`,
  cardTitle: `text-[20px] ${theme.weightBold} text-${theme.textPrimary}`,
  cardDesc: `mt-3 text-[16px] leading-relaxed text-${theme.textSecondary}`,
};

export default industryDesign;
