import { baseUrl, getConfig } from './config';
import { formatRecommendations, formatResponse } from './formatter';

const buildParams = (obj) => {
	const p = new URLSearchParams();
	Object.entries(obj).forEach(([k, v]) => {
		if (Array.isArray(v)) v.forEach((val) => p.append(k, val));
		else if (v !== undefined && v !== null && v !== '') p.append(k, v);
	});
	return p;
};

const get = (url) =>
	fetch(url).then((r) => {
		if (!r.ok) throw new Error(`Searchspring ${r.status}: ${r.statusText}`);
		return r.json();
	});

// ── Search / Collection Browse ─────────────────────────────────────────────────
export const search = async ({
	q = '',
	collectionHandle = '',
	page = 1,
	perPage = 12,
	sort = {},
	filters = {},
	selectedFacets = {},
}) => {
	const { siteId } = getConfig();
	const params = buildParams({
		resultsFormat: 'native',
		siteId,
		page,
		resultsPerPage: perPage,
		q: q || undefined,
		'bgfilter.collection_handle': collectionHandle || undefined,
		'bgfilter.ss_closeout': collectionHandle ? undefined : 'false',
		'bgfilter.mfield_denver_inventory_total_product_quantity.low': '1',
		...(sort.field ? { [`sort.${sort.field}`]: sort.direction } : {}),
	});

	Object.entries(filters).forEach(([key, vals]) => {
		(Array.isArray(vals) ? vals : [vals]).forEach((v) => params.append(`filter.${key}`, v));
	});

	const data = await get(`${baseUrl('/api/search/search.json')}?${params}`);
	return formatResponse(data, selectedFacets);
};

// ── Autocomplete ───────────────────────────────────────────────────────────────
export const autocomplete = async ({
	q = '',
	perPage = 6,
	includeProducts = true,
	includeSuggestions = true,
}) => {
	const { siteId } = getConfig();
	const params = buildParams({
		siteId,
		q,
		...(includeProducts && perPage > 0
			? { resultsFormat: 'native', resultsPerPage: perPage }
			: {}),
		...(includeSuggestions ? { suggestions: 'true' } : {}),
		'bgfilter.mfield_denver_inventory_total_product_quantity.low': '1',
	});
	return get(`${baseUrl('/api/search/autocomplete.json')}?${params}`);
};

// ── Recommendations ────────────────────────────────────────────────────────────
export const recommend = async ({ productIds = [], profile = 'product-page', limit = 4 }) => {
	const { siteId } = getConfig();
	const res = await fetch(`${baseUrl(`/boost/${siteId}/recommend`)}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			siteId,
			products: Array.isArray(productIds) ? productIds : [productIds],
			profiles: [{ tag: profile, limit }],
		}),
	});
	if (!res.ok) throw new Error(`Searchspring recommend ${res.status}`);
	const data = await res.json();
	return formatRecommendations(data);
};

// ── Trending Searches ──────────────────────────────────────────────────────────
export const trending = async () => {
	const { siteId } = getConfig();
	const params = buildParams({ siteId, limit: 10 });
	return get(`${baseUrl('/api/suggest/trending')}?${params}`);
};

// ── Similar Prints ─────────────────────────────────────────────────────────────
// Mirrors storefront services/searchspring/similarPrints.js — ported to fetch + no env deps.
export const similarPrints = async ({ print = '', productType = '', size = '', perPage = 20 }) => {
	const { siteId } = getConfig();
	const params = buildParams({
		resultsFormat: 'native',
		siteId,
		resultsPerPage: perPage,
		'bgfilter.mfield_denver_inventory_total_product_quantity.low': '1',
		...(print ? { 'filter.tags': print } : {}),
		...(productType ? { 'filter.product_type': productType } : {}),
		...(size ? { 'filter.ss_size': size } : {}),
	});
	const data = await get(`${baseUrl('/api/search/search.json')}?${params}`);
	const formatted = formatResponse(data);
	// Honour the storefront's "men's shorts handle-length" business rule.
	return {
		...formatted,
		results: formatted.results.filter((r) =>
			productType ? r.productType?.toLowerCase() === productType.toLowerCase() : true
		),
	};
};
