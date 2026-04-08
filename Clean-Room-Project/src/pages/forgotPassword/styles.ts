const forgotPasswordStyles = {

    page: "min-h-screen flex items-center justify-center px-4",
    pageBackground: "fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_#134e4a_0%,_#0f3330_50%,_#071a18_100%)]",
  
    // Card
    card: "bg-white rounded-md px-6 py-8 shadow-lg shadow-gray-300/70 min-w-[400px]",
  
    // Icon
    iconWrap: "w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 mx-auto",
  
    // Title
    title: "text-3xl font-bold text-center text-black mb-2",
    subtitle: "text-sm font-medium text-gray-500 text-center mb-6",
  
    // Divider
    divider: "mb-4 border-gray-200",
  
    // Field
    fieldGroup: "flex flex-col space-y-2 mt-[10px]",
    label: "text-base font-medium text-gray-500",
    inputWrapper: "relative",
    input: "border border-gray-200 w-full p-3 pl-10 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-300",
    inputIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-300",
    errorText: "text-red-500 text-xs mt-1 flex items-center gap-1",
  
    // Submit button — teal to match the page
    submitBtn: "bg-teal-600 text-white px-4 py-2 rounded-sm hover:bg-teal-700 h-10 shadow-lg w-full mt-4 font-semibold disabled:opacity-60",
  
    // Success state
    successWrap: "flex flex-col items-center gap-3 py-4",
    successIcon: "w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto",
    successTitle: "text-sm font-semibold text-slate-700 text-center",
    successMsg: "text-xs text-gray-500 text-center",
    successEmail: "font-semibold text-slate-700",
  
    // Back to login
    backBtn: "inline-flex items-center gap-1.5 text-black px-2 py-2 rounded-sm hover:text-gray-500 font-medium mx-auto mt-6",
  };
  
  export default forgotPasswordStyles;