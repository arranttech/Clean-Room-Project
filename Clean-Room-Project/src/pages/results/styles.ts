import theme from "../../styles/theme";

const resultsDesign = {
  wrap:  `${theme.pageWrapperWhite} px-3 sm:px-4 py-6 sm:py-10`,

  card:
    `mx-auto max-w-7xl bg-white ${theme.roundLg} border border-${theme.borderColor} ${theme.shadowSm} p-3 sm:p-6`,

  headerSection: `mb-4 sm:mb-6`,
  title:
    `${theme.h1} text-center`,
  subtitle:
    `mt-2 text-center text-${theme.primaryTextLight} text-sm sm:text-base`,

  tableOuter:
    `mt-4 sm:mt-8 ${theme.roundLg} border border-${theme.borderColor} overflow-hidden bg-white`,
  tableScroll:
    `w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`,
  table:
    `w-full border-separate border-spacing-0 min-w-[1700px]`,

  thead: `bg-slate-50`,
  th:
    `px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm ${theme.weightSemibold} text-${theme.textPrimary} text-left border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,
  thRoom:
    `sticky left-0 z-40 bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base ${theme.weightXBold} text-${theme.primaryTextLight} text-left border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,

  headerSubTitle:
    `sticky left-0 z-40 px-4 sm:px-6 py-3 sm:py-4 ${theme.weightSemibold} text-indigo-900 text-lg sm:text-2xl`,

  tr: `bg-white`,

  td:
    `px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-${theme.textPrimary} bg-white border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,
  tdRoom:
    `sticky left-0 z-30 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base ${theme.weightSemibold} text-${theme.textPrimary} border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,

  emptyRow:
    `px-4 sm:px-6 py-6 sm:py-8 text-center text-${theme.textMuted} bg-white border-b border-${theme.borderColor} text-sm`,

  footer:
    `mt-6 sm:mt-10 flex flex-col items-center gap-3`,
  footerTitle:
    `text-xs sm:text-sm text-${theme.textMuted}`,
  goHomeBtn:
    theme.btnPrimary,
};

export default resultsDesign;