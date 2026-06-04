// Runtime config — reads from window.__SS_CONFIG__ (Shopify Liquid injection)
// then falls back to Vite env vars (local dev).
export const getConfig = () => {
	const runtime = typeof window !== 'undefined' ? window.__SS_CONFIG__ || {} : {};
	return {
		siteId: runtime.siteId || import.meta.env.VITE_SS_SITE_ID || '',
		currency: runtime.currency || 'USD',
		moneyFormat: runtime.moneyFormat || '${{amount}}',
	};
};

export const baseUrl = (path) => {
	const { siteId } = getConfig();
	return `https://${siteId}.a.searchspring.io${path}`;
};
