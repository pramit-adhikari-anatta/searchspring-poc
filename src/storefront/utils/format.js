// Ported from /utils/format.js in the main storefront (USD-only for POC)
export const formatMonetaryValue = (value) => {
	if (!value && value !== 0) return '';
	return Intl.NumberFormat('en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
	}).format(value);
};
