const loginDesign = {
  wrapper:
    "min-h-screen p-4 flex flex-col justify-center items-center bg-gradient-to-br from-[#0c1a2e] via-[#0f2a4a] to-[#1a1a2e]",
  headerText: "text-center text-gray-600 text-sm mb-6",
  gridContainer: "grid grid-cols-1 gap-10 px-2 sm:px-4 md:px-10 w-full max-w-lg",

  card: "bg-white rounded-xl px-4 sm:px-6 py-6 sm:py-8 pt-5 sm:pt-7 shadow-xl w-full",
  cardTitle:
    "text-xl sm:text-3xl text-black-800 font-bold mb-2 text-center",
  cardInfo: "text-sm sm:text-base text-black mb-4 sm:mb-6 text-center",
  divider: "mb-4 border-gray-300",

  logoImg: "h-[60px] sm:h-[80px] w-full object-contain p-[1px] mt-[-30px] sm:mt-[-40px]",

  fieldGroup: "flex flex-col space-y-2 mt-[20px] sm:mt-[30px]",
  label: "text-gray-700 text-[13px] sm:text-[15px] font-medium",
  input:
    "border border-gray-200 w-full p-2.5 sm:p-3 pl-9 sm:pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm",
  inputWrapper: "relative mb-2",

  mailIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm",

  loginButton:
    "bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-600 h-9 sm:h-10 shadow-lg w-full text-sm sm:text-base",

  resetPwdLink:
    "inline-flex items-center gap-1.5 font-medium px-1 py-2 sm:py-3 mb-2 sm:mb-3 rounded-lg hover:text-blue-700 hover:font-medium ml-auto text-sm",
  nextLink:
    "inline-flex items-center justify-center gap-1.5 text-black px-1 py-2 rounded-lg hover:text-gray-800 font-medium mx-auto text-sm",
};

export default loginDesign;