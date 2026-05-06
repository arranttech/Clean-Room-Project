import theme from "../../styles/theme";

const resultsDesign = {
  wrap: "min-h-screen flex items-center justify-center bg-slate-50 px-4",
  card: "w-full max-w-5xl bg-white rounded-xl shadow-lg px-12 py-10",  // headerSection: `mb-4 sm:mb-6`,
  // title:
  //   `${theme.h1} text-center`,
  // subtitle:
  //   `mt-2 text-center text-${theme.primaryTextLight} text-sm sm:text-base`,

  // tableOuter:
  //   `mt-4 sm:mt-8 ${theme.roundLg} border border-${theme.borderColor} overflow-hidden bg-white`,
  // tableScroll:
  //   `w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`,
  // table:
  //   `w-full border-separate border-spacing-0 min-w-[1700px]`,

  // thead: `bg-slate-50`,
  // th:
  //   `px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm ${theme.weightSemibold} text-${theme.textPrimary} text-left border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,
  // thRoom:
  //   `sticky left-0 z-40 bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base ${theme.weightXBold} text-${theme.primaryTextLight} text-left border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,

  // headerSubTitle:
  //   `sticky left-0 z-40 px-4 sm:px-6 py-3 sm:py-4 ${theme.weightSemibold} text-indigo-900 text-lg sm:text-2xl`,

  // tr: `bg-white`,

  // td:
  //   `px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-${theme.textPrimary} bg-white border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,
  // tdRoom:
  //   `sticky left-0 z-30 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base ${theme.weightSemibold} text-${theme.textPrimary} border-b border-r border-${theme.borderColor} whitespace-nowrap align-middle`,

  // emptyRow:
  //   `px-4 sm:px-6 py-6 sm:py-8 text-center text-${theme.textMuted} bg-white border-b border-${theme.borderColor} text-sm`,
headerSection: "text-center mb-8 flex flex-col items-center",

successIcon:
  "w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-4",

title: "text-2xl font-bold text-gray-900 mb-2",

subtitle: "text-sm text-gray-500 mb-1",

description: "text-sm text-gray-400",

  detailsBox:
  "grid grid-cols-2 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8",
  
  detailLabel: "text-xs font-semibold text-gray-500 mb-1",
  detailValue: "text-sm font-medium text-gray-900",
  buttonRow: "grid grid-cols-2 gap-6 mb-8",

   primaryBtn:
    "h-12 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600",

   secondaryBtn:
    "h-12 border border-orange-500 text-orange-600 rounded-lg font-semibold hover:bg-orange-50",
  divider: "border-t border-slate-200 my-6",

  reportTitle: "text-sm font-bold text-slate-700 mb-3",

  reportList: "space-y-2 text-sm text-slate-600",

  reportItem: "flex items-start gap-2",

  check:
  "w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-bold",

  footer: "mt-8 flex justify-center",
  // footer:
  //   `mt-6 sm:mt-10 flex flex-col items-center gap-3`,
  // footerTitle:
  //   `text-xs sm:text-sm text-${theme.textMuted}`,
  goHomeBtn:
  "flex items-center gap-2 text-gray-600 font-medium hover:text-orange-600",
};

export default resultsDesign;