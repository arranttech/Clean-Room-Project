import theme from "../../styles/theme";

const registerDesign = {
  wrapper: `${theme.pageWrapperCenterMiddle} bg-gray-100`,
  headerText: `text-center text-${theme.textSecondary} text-sm mb-6`,
  gridContainer: `grid grid-cols-1 md:grid-cols-1 gap-10 px-4 md:px-10`,

  card: `bg-white ${theme.roundMd} px-6 py-8 ${theme.shadowLg} shadow-gray-300/70 min-w-[400px] min-h-[400px]`,
  cardTitle: `text-black-800 ${theme.weightBold} mb-2 text-center text-3xl`,
  cardInfo: `font-medium text-${theme.textSecondary} mb-2 text-center`,
  divider: `mb-4 border-${theme.borderColor}`,

  logoImg: `h-[60px] w-full object-contain p-[5px] mt-[-20px]`,

  fieldGroup: `flex flex-col space-y-2 mt-[10px]`,
  label: `text-base ${theme.weightMedium} text-${theme.textSecondary}`,
  input: `border border-${theme.borderColor} w-full p-3 pl-10 ${theme.roundSm} focus:outline-none focus:ring-2 focus:ring-blue-300`,
  inputWrapper: `relative`,

  mailIcon: `absolute left-3 top-1/2 -translate-y-1/2 text-${theme.textDisabled}`,

  loginButton: `bg-${theme.primary} text-white px-4 py-2 ${theme.roundSm} hover:bg-${theme.primaryHover} h-10 ${theme.shadowLg}`,

  nextLink: `inline-flex items-center gap-1.5 text-black px-2 py-2 ${theme.roundSm} hover:text-${theme.textSecondary} ${theme.weightMedium} ml-auto`,
};

export default registerDesign;