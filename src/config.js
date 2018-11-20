export default {
  colors: {
    default: "#344675",
    primary: "#42b883",
    info: "#1d8cf8",
    danger: "#fd5d93",
    teal: "#00d6b4",
    primaryGradient: ['rgba(76, 211, 150, 0.1)', 'rgba(53, 183, 125, 0)', 'rgba(119,52,169,0)'],
  },
  backend_host: "http://localhost:8011",
	PO_STATUS_PENDING: 0,
	PO_STATUS_RM_APPROVED: 1,
	PO_STATUS_ACCT_APPROVED: 2,
	PO_STATUS_CHECKER: 2,
	PO_STATUS_DONE: 3,
  PO_STATUS_RM_DECLINED: -1,
	PO_STATUS_ACCT_DECLINED: -2
}