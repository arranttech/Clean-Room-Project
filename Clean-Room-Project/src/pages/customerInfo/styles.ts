import theme from "../../styles/theme";

const customerInfoDesign = {
  wrapper:
    `${theme.pageWrapperWhite} flex flex-col items-center px-8 py-6`,

  top:        `mb-4 text-center w-full max-w-3xl`,
  headerRow:  `flex items-center justify-center gap-3 mb-1`,
  headerIcon:
    `w-10 h-10 bg-${theme.primaryLight} ${theme.roundMd} flex items-center justify-center text-${theme.primaryText} text-xl shrink-0`,
  title:      theme.h1,
  headerText: theme.pageSubtitle,

  card:       `${theme.cardPaddedLg} w-full max-w-3xl`,
  cardTitle:  `${theme.h2} mb-3`,
  divider:    `${theme.divider} mb-6`,

  fieldGroup: theme.formGroup,
  label:      theme.labelBold,

  input:         theme.input,
  inputDisabled: theme.inputGreen,
  textarea:      theme.textarea,
  disabledInput: theme.inputDisabled,

  footer:     `flex items-center justify-between w-full max-w-3xl mt-6`,
  cancelLink: theme.btnSecondary,
  nextLink:   theme.btnPrimaryLg,
  disabled:   theme.btnDisabled,

  popupOverlay:     theme.modalOverlay,
  popupBackdrop:    theme.modalBackdrop,
  popupCard:        theme.successPopupCard,
  popupIcon:        theme.successPopupIcon,
  popupTitle:       `text-xl ${theme.weightBold} text-gray-900`,
  popupMessage:     `text-sm text-${theme.textMuted} text-center`,
  popupProgressWrap: theme.successProgressWrap,
  popupProgressBar:
    `bg-${theme.success} h-1 ${theme.roundFull} animate-[shrink_2s_linear_forwards]`,
};

export default customerInfoDesign;