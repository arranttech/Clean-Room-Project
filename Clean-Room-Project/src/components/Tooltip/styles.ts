import theme from "../../styles/theme";

const TooltipDesign = {

    container:
        `z-[9999] !opacity-100 ${theme.roundSm} !bg-[#0F172A] px-[16px] py-[12px] text-left text-[13px] leading-[1.5] !text-white ${theme.shadowLg} max-w-[300px] border border-[#1E293B]`,

    arrow:
        "!border-t-[#0F172A] !border-b-[#0F172A]",

    containerLight:
        `z-[9999] !opacity-100 ${theme.roundSm} !bg-white px-[16px] py-[12px] text-left text-[13px] leading-[1.5] !text-slate-800 ${theme.shadowLg} max-w-[300px] border border-${theme.borderColor}`,

    arrowLight:
        "!border-t-white !border-b-white",

    triggerWrapper:
        `inline-flex items-center cursor-pointer text-black hover:text-gray-700 ${theme.transitionColors} duration-200 ml-1 translate-y-[2px]`,

    icon:
        `text-${theme.textDisabled} hover:text-${theme.textSecondary}`,
}

export default TooltipDesign;
