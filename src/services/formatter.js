const decodeHtml = (str = '') =>
	str
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');

const parseVariants = (raw) => {
	if (!raw) return [];
	try {
		return JSON.parse(decodeHtml(raw)).map((v) => ({
			title: v.title,
			price: parseFloat(v.price),
			compareAtPrice: parseFloat(v.compare_at_price),
			inventory: parseInt(v.inventory_quantity) || 0,
			sku: v.sku,
			variantId: v.admin_graphql_api_id,
		}));
	} catch {
		return [];
	}
};

export const formatProduct = (p) => {
	const decoded = decodeHtml(p.name || '');
	const [title, description = ''] = decoded.split(' | ');
	return {
		id: p.uid,
		handle: (p.url || '').split('/products/')[1] || '',
		title,
		description,
		imageSrc: p.image || p.imageUrl || '',
		imageAlt: decoded,
		extraImages: p.images ? p.images.split('|') : [],
		price: parseFloat(p.price) || 0,
		compareAtPrice: parseFloat(p.msrp) || 0,
		productType: p.product_type || '',
		rating: parseFloat(p.rating) || 0,
		ratingCount: parseInt(p.ratingCount) || 0,
		tags: Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [],
		variants: parseVariants(p.variants),
	};
};

export const formatResponse = (data, selectedFacets = {}) => ({
	results: (data.results || []).map(formatProduct),
	pagination: {
		totalResults: data.pagination?.totalResults || 0,
		totalPages: data.pagination?.totalPages || 1,
		currentPage: data.pagination?.currentPage || 1,
		perPage: data.pagination?.perPage || 48,
	},
	facets: (data.facets || []).map((f) => ({
		key: f.field,
		label: f.label,
		values: (f.values || []).map((v) => ({
			label: v.label,
			count: v.count,
			selected: selectedFacets[f.field]?.includes(v.label) || false,
		})),
	})),
	didYouMean: data.didYouMean || null,
});

export const formatRecommendations = (data) => {
	const set = data?.[0];
	if (!set?.results) return [];
	return set.results.map((item) => formatProduct(item.mappings?.core || item));
};
