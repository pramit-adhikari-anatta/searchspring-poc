/**
 * Ported from /services/static/product-sticker.js in the main storefront.
 *
 * Returns the sticker SVG/PNG URL for a product, or undefined if no sticker applies.
 * These are the image overlays shown in the top-right corner of product cards on
 * shinesty.com — e.g. "With Fly", "Magnum Pouch", "Long", "Trunk", "Cooling".
 *
 * Priority order mirrors the storefront exactly.
 *
 * @param {{ productType: string, tags: string[] }} product
 *   - productType: from formatProduct() (e.g. "Boxers - Fly")
 *   - tags: lowercased string array from formatProduct()
 * @returns {string|undefined}
 */
export function getProductSticker({ productType = '', tags = [] } = {}) {
	const type = productType.toLowerCase();

	// Helper: case-insensitive tag check (tags are already lowercased by the formatter)
	const hasTag = (toCheck) =>
		tags.some((t) => t.trim() === toCheck.toLowerCase().trim());

	// ── Out-of-stock states (inventory data not available from Searchspring in POC) ──
	// Skipped: variants_inventory_count is not in the formatted product shape.

	// ── Feature stickers — priority order from storefront ────────────────────────
	if (type === 'boxers - magnum pouch') {
		return 'https://assets.shinesty.com/icons/MagnumPouch_VI.svg';
	}
	if (hasTag('feature: subscription exclusive')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/subscription-exclusive.svg';
	}
	if (['boys underwear', 'boys underwear - pack'].includes(type)) {
		return 'https://assets.shinesty.com/icons/boys-sticker.svg';
	}
	if (hasTag('deal_of_the_week: true')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/deal-of-the-week-larger.svg';
	}
	if (hasTag('flash_sale: true')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/Flasher_Icon-02.svg';
	}
	if (hasTag('feature: glows')) {
		return 'https://cdn.shinesty.com/2024-08-27/glow in the dark.svg';
	}
	if (hasTag('feature: fly')) {
		return 'https://cdn.shinesty.com/2024-08-27/with fly boxer.svg';
	}
	if (hasTag('feature: long leg')) {
		return 'https://cdn.shinesty.com/2024-08-27/loong.svg';
	}
	if (hasTag('feature: fur')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/fur.svg';
	}
	if (type === 'boxers - trunk') {
		return 'https://cdn.shinesty.com/2024-08-27/mens trunks.svg';
	}
	if (hasTag('feature: shop now')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/ships-now.svg';
	}
	if (hasTag('category: pre order')) {
		return 'https://d3w0qy4ktfyhb7.cloudfront.net/icons/product-stickers/preorder.svg';
	}
	if (hasTag('feature: fart-blocking')) {
		return 'https://cdn.shinesty.com/2026-04-09/fart-filtering-icon.png';
	}
	if (
		['boxers - cooling - fly', 'bralettes - cooling', 'thongs - cooling'].includes(type) ||
		hasTag('feature: cooling')
	) {
		return 'https://assets.shinesty.com/icons/Cooling_Tag.svg';
	}

	return undefined;
}
