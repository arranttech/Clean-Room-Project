import theme from "../../styles/theme";

const customerInfoDesign = {
  wrapper:
    "min-h-screen bg-white flex flex-col items-center px-8 py-6 font-sans",

  top:        "mb-4 text-center w-full max-w-3xl",
  headerRow:  "flex items-center justify-center gap-3 mb-1",
  headerIcon:
    "w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl shrink-0",
  title:      theme.pageTitle,
  headerText: theme.pageSubtitle,

  card:      theme.cardPaddedLg + " w-full max-w-3xl",
  cardTitle: theme.sectionHeader + " mb-3",
  divider:   theme.divider + " mb-6",

  fieldGroup: "flex flex-col gap-1 mb-5",
  label:      theme.labelBold,

  input:        theme.input,
  inputDisabled: theme.inputGreen,
  textarea:     theme.textarea,
  disabledInput: theme.inputDisabled,

  footer:     "flex items-center justify-between w-full max-w-3xl mt-6",
  cancelLink: theme.btnSecondary,
  nextLink:   theme.btnPrimaryLg,
  disabled:   theme.btnDisabled,

  popupOverlay:     theme.modalOverlay,
  popupBackdrop:    theme.modalBackdrop,
  popupCard:        theme.successPopupCard,
  popupIcon:        theme.successPopupIcon,
  popupTitle:       "text-xl font-bold text-gray-900",
  popupMessage:     "text-sm text-gray-500 text-center",
  popupProgressWrap: theme.successProgressWrap,
  popupProgressBar:
    "bg-green-500 h-1 rounded-full animate-[shrink_2s_linear_forwards]",
};

export default customerInfoDesign;