import theme from "../../styles/theme";

const dashboardDesign = {
  /* page */
  page: theme.pageWrapper,

  /* body */
  contentWrap: `pt-6 pb-10 px-3 sm:px-6`,
  container: `px-2 sm:px-6 lg:px-10 mx-auto ${theme.contentMaxWidth5xl}`,
  headerWrap: `mb-6`,
  title2: `text-2xl sm:text-3xl ${theme.weightXBold} text-${theme.textPrimary}`,
  subtitle2: `mt-1 text-sm text-${theme.textMuted}`,

  /* metrics */
  metricsRow: `mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4`,
  metricCard:
    `bg-white ${theme.roundMd} border border-${theme.borderColor} ${theme.shadowSm} p-3 sm:p-5 flex items-center gap-2 sm:gap-4`,
  metricIconWrap:
    `h-9 w-9 sm:h-11 sm:w-11 ${theme.roundMd} flex items-center justify-center flex-shrink-0`,
  metricNumber: `text-xl sm:text-2xl ${theme.weightXBold} leading-none`,
  metricLabel: `mt-0.5 text-xs sm:text-sm text-${theme.textMuted}`,
  sectionCard: `mt-6 bg-white ${theme.roundMd} border border-${theme.borderColor} ${theme.shadowSm} p-4 sm:p-6`,
  sectionTitle: `text-base sm:text-lg ${theme.weightBold} text-${theme.textPrimary}`,
  cardWrap:
    `flex flex-col sm:flex-row border border-${theme.borderColor} ${theme.roundMd} p-4 sm:p-6 mt-5 gap-4 sm:items-center`,
  cardHeader: `flex items-center justify-between gap-4 flex-wrap`,
  projectTitle: `text-[17px] sm:text-[19px] ${theme.weightBold} text-black`,
  pendingProjects: `text-[13px] sm:text-[14px] text-${theme.textSecondary} ${theme.weightSemibold} mr-2 sm:mr-5`,
  projectCustomer: `mt-1 text-[15px] sm:text-[17px] text-${theme.textMuted} ${theme.weightSemibold}`,
  cardStyle: `flex flex-col md:flex-row md:items-center gap-3 sm:gap-6 mt-3`,
  projectPendingStage:
    `text-[14px] sm:text-[16px] text-${theme.primaryText} ${theme.weightBold} bg-${theme.primaryLight} inline-block px-3 py-1 rounded-[5px]`,
  projectPendingPage: `text-[15px] sm:text-[17px] text-${theme.textMuted} ${theme.weightSemibold}`,
  projectModifiedDate: `text-[13px] sm:text-[14px] text-${theme.textMuted} ${theme.weightMedium} mt-1`,
  buttonStyle: `sm:ml-auto items-center`,
  viewAllButton:
    `bg-${theme.primary} text-white px-4 sm:px-6 py-[10px] sm:py-[12px] ${theme.roundMd} hover:bg-${theme.primaryHover} ${theme.shadowSm} text-[15px] sm:text-[17px] ${theme.weightMedium} flex flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto justify-center`,
  quickGrid: `mt-5 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3`,
  actionCardBase:
    `${theme.roundMd} border border-${theme.borderColor} p-4 sm:p-5 flex gap-3 sm:gap-4 items-start transition ${theme.shadowSm} hover:${theme.shadowMd} bg-white`,
  actionCardHover:
    `hover:bg-blue-50 hover:border-blue-600 hover:ring-1 hover:ring-blue-600`,
  actionIconWrap:
    `h-9 w-9 sm:h-10 sm:w-10 ${theme.roundMd} flex items-center justify-center ${theme.shadowSm} flex-shrink-0`,
  actionTitle: `text-sm sm:text-base ${theme.weightBold} text-${theme.textPrimary}`,
  actionDesc: `mt-1 text-xs sm:text-sm text-${theme.textSecondary} leading-relaxed`,
  actionHint: `mt-2 sm:mt-3 text-xs sm:text-sm ${theme.weightSemibold} text-${theme.primaryText}`,
  featuresCard:
    `mt-6 bg-white ${theme.roundLg} border border-${theme.borderColor} ${theme.shadowSm} p-4 sm:p-6`,
  featuresTitle: `text-[16px] sm:text-[18px] ${theme.weightBold} text-${theme.textPrimary}`,
  featuresGrid: `mt-5 grid grid-cols-1 gap-5 md:grid-cols-3`,
  featureItem: `${theme.roundLg} border border-${theme.borderColor} bg-white p-4 sm:p-6 ${theme.shadowSm}`,
  featureIconWrap:
    `h-12 w-12 sm:h-14 sm:w-14 ${theme.roundLg} bg-${theme.primaryLight} flex items-center justify-center`,
  featureTitle: `mt-4 sm:mt-5 text-[16px] sm:text-[18px] ${theme.weightBold} text-${theme.textPrimary}`,
  featureDesc: `mt-2 text-[13px] sm:text-[14px] text-${theme.textSecondary} leading-relaxed`,
  featureList: `mt-4 space-y-2 text-[13px] sm:text-[14px] text-${theme.textSecondary}`,
  featureBullet: `flex items-start gap-2`,
  popupOverlay: `fixed inset-0 flex items-center justify-center z-50`,
  popupBackdrop: theme.modalBackdrop,
  popupCard:
    `relative bg-white ${theme.roundLg} ${theme.shadow2xl} p-6 sm:p-10 max-w-md w-full mx-4`,
  popupHeader: `flex items-center gap-4 mb-6`,
  popupIconWrap:
    `w-12 h-12 sm:w-14 sm:h-14 ${theme.roundFull} bg-${theme.warningBg} flex items-center justify-center shrink-0`,
  popupIcon: `text-${theme.warning} text-2xl sm:text-3xl`,
  popupTitle: `text-xl sm:text-2xl ${theme.weightBold} text-gray-900`,
  popupDesc: `text-sm sm:text-base text-${theme.textMuted} mb-6`,
  popupInfoBox: `bg-${theme.primaryLight}/50 border border-${theme.primaryBorder} ${theme.roundMd} px-4 sm:px-6 py-4 sm:py-5 mb-6 sm:mb-8`,
  popupInfoTitle: `text-sm sm:text-base ${theme.weightSemibold} text-${theme.primaryText} mb-3`,
  popupInfoList: `space-y-2`,
  popupInfoItem: `text-sm sm:text-base text-${theme.primaryTextLight}`,
  popupFooter: `flex gap-3 sm:gap-4`,
  popupCancelBtn:
    `flex-1 px-3 sm:px-4 py-3 sm:py-4 border border-${theme.borderColor} ${theme.roundLg} text-xs sm:text-sm ${theme.weightSemibold} text-${theme.textSecondary} bg-white hover:bg-slate-50 ${theme.transitionColors}`,
  popupConfirmBtn:
    `flex-1 px-3 sm:px-4 py-3 sm:py-4 bg-${theme.primary} text-white text-xs sm:text-sm ${theme.weightSemibold} ${theme.roundLg} hover:bg-${theme.primaryHover} ${theme.transitionColors}`,

  /* ── AllProjects page ── */
  container1: `mx-auto max-w-7xl px-4 sm:px-8 pb-16`,
  titleRow: `relative flex items-center pt-8 mb-8`,
  listTitle: `text-2xl md:text-3xl ${theme.weightXBold} text-${theme.textPrimary} mx-auto`,
  countBadge:
    `absolute right-0 inline-flex items-center ${theme.roundFull} border border-${theme.successBorder} bg-${theme.successBg} ${theme.shadowSm} px-4 py-1.5 text-[13px] ${theme.weightSemibold} text-${theme.successText}`,
  stateWrap: `mt-24 flex flex-col items-center gap-4 text-center`,
  stateTitle: `text-[17px] ${theme.weightBold} text-${theme.textPrimary}`,
  stateDesc: `text-sm text-${theme.textMuted} max-w-sm leading-relaxed`,
  errorText: `mt-16 text-center text-${theme.error} text-sm`,
  emptyIconWrap:
    `h-16 w-16 ${theme.roundFull} bg-slate-100 flex items-center justify-center`,
  cardsList: `mt-2 flex flex-col gap-6`,
  projectCard:
    `bg-white ${theme.roundLg} border border-${theme.primaryBorder} ${theme.shadowMd} hover:${theme.shadowLg} ${theme.transition} px-4 sm:px-10 py-6 sm:py-8`,
  projectHeaderRow: `flex items-start justify-between gap-4`,
  cardLeft: `flex flex-col`,
  nameBadgeRow: `flex items-center gap-3 flex-wrap`,
  projectName: `text-[18px] sm:text-[20px] ${theme.weightBold} text-${theme.textPrimary} leading-tight`,
  badgeCompleted:
    `inline-flex items-center ${theme.roundFull} bg-${theme.successBg} text-${theme.successText} border border-${theme.successBorder} px-4 py-1 text-[13px] ${theme.weightMedium}`,
  metaId: `text-[13px] text-${theme.textMuted} mt-2 ${theme.weightMedium}`,
  metaDate: `text-[13px] text-${theme.textMuted} mt-0.5 ${theme.weightMedium}`,
  btnGroup: `flex items-center gap-3 flex-shrink-0`,
  primaryBtn: theme.btnPrimary,
  secondaryBtn: theme.btnSecondary,
  divider: `mt-6 border-t border-${theme.borderStrong}`,
  infoGrid: `mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4`,
  kvWrap: `flex items-start gap-3 min-w-0 min-h-[60px] sm:min-h-[80px]`,
  kvValue:
    `text-[14px] sm:text-[15px] ${theme.weightBold} text-${theme.textPrimary} mt-0.5 break-words line-clamp-3`,
  kvIcon: `mt-0.5 text-${theme.primaryText} text-[18px] sm:text-[20px] flex-shrink-0`,
  kvBody: `flex flex-col`,
  kvLabel: `text-[11px] sm:text-[12px] ${theme.weightSemibold} text-${theme.primaryTextLight} uppercase tracking-wide`,
  backBtn1:
    `mt-10 inline-flex items-center gap-2 border border-${theme.borderColor} px-5 py-2.5 ${theme.roundMd} hover:bg-slate-100 ${theme.shadowSm} bg-white text-[14px] ${theme.weightMedium} ${theme.transitionColors}`,

  /* Customer dropdown */
  customerDropdownBtn: `flex items-center gap-2 sm:gap-3 bg-white border border-${theme.borderColor} ${theme.roundMd} px-3 sm:px-4 py-2 sm:py-3 ${theme.shadowSm} hover:${theme.shadowMd} hover:border-blue-400 ${theme.transition}`,
  customerDropdownIconWrap: `h-8 w-8 sm:h-9 sm:w-9 ${theme.roundSm} bg-${theme.primaryLight} flex items-center justify-center flex-shrink-0`,
  customerDropdownSubLabel: `text-[10px] sm:text-[11px] text-${theme.textDisabled} ${theme.weightMedium} uppercase tracking-widest leading-none mb-0.5`,
  customerDropdownName: `text-[13px] sm:text-[15px] ${theme.weightBold} text-${theme.textPrimary} leading-none truncate max-w-[100px] sm:max-w-[160px]`,
  customerDropdownChevron: `text-${theme.textDisabled} text-xs ml-1 transition-transform duration-200`,
  customerDropdownList: `absolute right-0 top-[calc(100%+8px)] z-50 bg-[#F4F7FB] border border-${theme.borderColor} ${theme.roundMd} ${theme.shadow2xl} min-w-[280px] sm:min-w-[320px] max-w-[400px] py-0 overflow-hidden`,
  customerDropdownItem: `w-full text-left px-4 py-3 text-sm ${theme.transitionColors} hover:bg-blue-50 flex items-center justify-between gap-3 border-b border-[#EAEFF5] last:border-b-0`,
  customerDropdownItemActive: `bg-blue-50/50 ${theme.weightSemibold} text-${theme.primaryText}`,
  customerDropdownItemInactive: `text-${theme.textSecondary} bg-white`,
  customerDropdownItemIcon: `h-7 w-7 ${theme.roundSm} bg-${theme.primaryLight} flex items-center justify-center flex-shrink-0`,
  customerDropdownHeader: `px-4 py-3 border-b border-slate-200 bg-white flex flex-col justify-center`,
  customerDropdownHeaderTitle: `text-[12px] font-bold text-slate-700 uppercase tracking-wide`,
  customerDropdownHeaderSubtitle: `text-[14px] text-slate-600 mt-0.5`,
  customerDropdownScrollArea: `max-h-80 overflow-y-auto`,
  customerDropdownItemContent: `flex items-start gap-3 w-full`,
  customerDropdownRadioWrap: `mt-0.5 relative flex items-center justify-center h-5 w-5 flex-shrink-0`,
  customerDropdownRadioBase: `peer appearance-none h-5 w-5 rounded-full outline-none transition focus:ring-0 cursor-pointer`,
  customerDropdownRadioSelected: `bg-blue-600 border-none`,
  customerDropdownRadioUnselected: `border border-slate-300 bg-white`,
  customerDropdownCheckIcon: `absolute text-white text-[10px] pointer-events-none`,
  customerDropdownTextWrap: `flex flex-col text-left overflow-hidden`,
  customerDropdownItemNameBase: `text-[15px] font-bold block truncate`,
  customerDropdownItemNameSelected: `text-blue-600`,
  customerDropdownItemNameUnselected: `text-slate-800`,
  customerDropdownItemAddress: `text-[13px] text-slate-500 mt-0.5 block truncate`,
  welcomeRow: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6`,
  welcomeLeft: "",

  /* Switch Customer Modal specific */
  switchHeaderRow: `flex items-center gap-3`,
  switchIconWrap: `w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#E8F0FE] flex items-center justify-center shrink-0`,
  switchIcon: `text-blue-600 text-xl sm:text-2xl`,
  switchCloseBtn: `text-slate-400 hover:text-slate-600 transition-colors ml-auto`,
  switchCloseIcon: `text-lg`,
  switchDesc: `text-sm sm:text-base text-slate-600 mb-6 border-b border-slate-100 pb-6`,
  switchDescHighlight: `font-bold text-slate-900`,
  switchWarningBox: `bg-[#FFF8E6] border border-[#FFE0A3] ${theme.roundLg} px-4 sm:px-5 py-4 mb-6 sm:mb-8 flex items-start gap-3`,
  switchWarningIcon: `text-[#F59E0B] text-lg sm:text-xl mt-0.5 shrink-0`,
  switchWarningText: `text-sm text-[#D97706] ${theme.weightMedium} leading-relaxed`,
  switchBtnGroup: `flex gap-3 sm:gap-4 justify-end`,
  switchCancelBtn: `px-5 py-2.5 border border-slate-300 ${theme.roundLg} text-sm ${theme.weightSemibold} text-slate-700 bg-white hover:bg-slate-50 ${theme.transitionColors}`,
  switchConfirmBtn: `px-5 py-2.5 bg-blue-600 text-white text-sm ${theme.weightSemibold} ${theme.roundLg} hover:bg-blue-700 ${theme.transitionColors}`,
};

export default dashboardDesign;