import theme from "../../styles/theme";

const loginDesign = {
  wrapper:
    `min-h-screen p-4 flex flex-col justify-center items-center bg-gradient-to-br from-[#0c1a2e] via-[#0f2a4a] to-[#1a1a2e]`,
  headerText: `text-center text-${theme.textMuted} text-sm mb-6`,
  gridContainer: `grid grid-cols-1 gap-10 px-2 sm:px-4 md:px-10 w-full max-w-lg`,

  card: `bg-white ${theme.roundMd} px-4 sm:px-6 py-6 sm:py-8 pt-5 sm:pt-7 ${theme.shadowLg} w-full`,
  cardTitle:
    `text-xl sm:text-3xl text-black-800 ${theme.weightBold} mb-2 text-center`,
  cardInfo: `text-sm sm:text-base text-black mb-4 sm:mb-6 text-center`,
  divider: `mb-4 border-${theme.borderColor}`,

  logoImg: `h-[60px] sm:h-[80px] w-full object-contain p-[1px] mt-[-30px] sm:mt-[-40px]`,

  fieldGroup: `flex flex-col space-y-2 mt-[20px] sm:mt-[30px]`,
  label: `text-${theme.textSecondary} text-[13px] sm:text-[15px] ${theme.weightMedium}`,
  input:
    `border border-${theme.borderColor} w-full p-2.5 sm:p-3 pl-9 sm:pl-10 ${theme.roundSm} focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm`,
  inputWrapper: `relative mb-2`,

  mailIcon: `absolute left-3 top-1/2 -translate-y-1/2 text-${theme.textDisabled} text-sm`,

  loginButton:
    `bg-${theme.primary} text-white px-4 py-2 ${theme.roundSm} hover:bg-${theme.primaryHover} h-9 sm:h-10 ${theme.shadowLg} w-full text-sm sm:text-base`,

  resetPwdLink:
    `inline-flex items-center gap-1.5 ${theme.weightMedium} px-1 py-2 sm:py-3 mb-2 sm:mb-3 ${theme.roundSm} hover:text-${theme.primary} hover:font-medium ml-auto text-sm`,
  nextLink:
    `inline-flex items-center justify-center gap-1.5 text-black px-1 py-2 ${theme.roundSm} hover:text-${theme.textSecondary} ${theme.weightMedium} mx-auto text-sm`,
};

export default loginDesign;