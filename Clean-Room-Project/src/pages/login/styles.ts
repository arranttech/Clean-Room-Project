import theme from "../../styles/theme";

const loginDesign = {
  wrapper: `h-screen overflow-hidden flex flex-col justify-center items-center bg-gradient-to-br from-[#0c1a2e] via-[#0f2a4a] to-[#1a1a2e] p-4`,

  headerText: `text-center text-${theme.textMuted} text-sm mb-6`,
  gridContainer: `w-full max-w-[460px] px-2 sm:px-0`,

  card: `bg-white rounded-2xl px-5 sm:px-8 md:px-10 py-7 sm:py-9 shadow-2xl w-full`,

  logoImg: `h-[66px] sm:h-[90px] w-auto mx-auto block mb-4 object-contain`,

  // Darker title
  cardTitle: `text-2xl sm:text-2xl font-bold text-[#0a1628] text-center mb-1 tracking-tight`,

  // Darker subtitle
  cardInfo: `text-sm text-[#2d4a6a] text-center mb-5 font-medium`,

  divider: `border-gray-200 mb-5`,

  fieldGroup: `flex flex-col gap-1`,

  // Darker labels — slightly bigger
  label: `text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1`,

  inputWrapper: `relative mb-4`,

  input: `w-full bg-gray-50 border border-gray-200 text-[#0a1628] text-sm rounded-xl px-4 pl-11 pr-11 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition`,

  mailIcon: `absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm`,

  eyeBtn: `absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer`,

  // Bigger and darker forgot password
  resetPwdLink: `flex justify-end text-sm font-bold text-[#0f2a4a] hover:text-blue-600 hover:underline transition mb-4 -mt-2`,

  // Sign in button — blue gradient
  loginButton: `w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm py-3 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all mb-3`,

  googleButton: `w-full flex items-center justify-center gap-3 border border-blue-400 hover:bg-blue-600 text-black font-medium text-sm py-3 sm:py-3.5 rounded-xl shadow-sm hover:shadow transition-all`,
  nextLink: `inline-flex items-center justify-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 font-medium mx-auto mt-2`,
};

export default loginDesign;