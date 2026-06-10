/**
 * Subscription price lookup for the Searchspring POC.
 * Ported from /services/static/subscription/subscriptions-ordergroove.js
 * and /services/static/default-prices.js in the main storefront.
 *
 * Only monthly prices are mapped here — this is what appears on product cards
 * via the ProductCardBanner pattern: "($19.99 On Subscription)"
 *
 * To fully restore: swap these static values with a call to
 * getSubscriptionForProductType(productType) from the storefront service, and
 * honour discount-code overrides via DiscountCodeStore.
 */

// ── Monthly subscription prices (from /services/static/default-prices.js) ────
const MENS_MONTHLY = 19.99;    // DEFAULT_PRICE_SUBSCRIPTION_MENS_UNDERWEAR_MONTHLY_DECIMAL
const WOMENS_MONTHLY = 15.99;  // DEFAULT_PRICE_SUBSCRIPTION_WOMENS_UNDERWEAR_MONTHLY_DECIMAL
const BRALETTE_MONTHLY = 19.99; // DEFAULT_PRICE_SUBSCRIPTION_WOMENS_BRALETTE_MONTHLY_DECIMAL
const THONG_MONTHLY = 10.99;   // DEFAULT_PRICE_SUBSCRIPTION_WOMENS_THONG_MONTHLY_DECIMAL
const BOYS_MONTHLY = 14.99;    // DEFAULT_PRICE_SUBSCRIPTION_BOYS_UNDERWEAR_MONTHLY_DECIMAL
const TSHIRT_MONTHLY = 19.99;  // DEFAULT_PRICE_TSHIRTS_DECIMAL (monthly)
const LAUNDRY_MONTHLY = 11.99; // DEFAULT_PRICE_LAUNDRY_SHEETS_DECIMAL_SUBSCRIPTION

// ── productType → monthly subscription price ──────────────────────────────────
const SUBSCRIPTION_MONTHLY_BY_TYPE = {
	'Bikini': WOMENS_MONTHLY,
	'Boyshort': WOMENS_MONTHLY,
	'Seamless Boyshort': WOMENS_MONTHLY,
	'Cheeky': WOMENS_MONTHLY,
	"Women's Boxer": WOMENS_MONTHLY,
	'Thongs - Modal': WOMENS_MONTHLY,
	'Thongs - Cooling': WOMENS_MONTHLY,

	'Thongs': THONG_MONTHLY,

	'Bralettes': BRALETTE_MONTHLY,
	'Bralettes - Busty': BRALETTE_MONTHLY,
	'Bralettes - Triangle': BRALETTE_MONTHLY,
	'Bralettes - Cooling': BRALETTE_MONTHLY,

	'Boys Underwear': BOYS_MONTHLY,

	'Boxers': MENS_MONTHLY,
	'Boxers - Brief': MENS_MONTHLY,
	'Boxers - Fly': MENS_MONTHLY,
	'Boxers - Long - Fly': MENS_MONTHLY,
	'Boxers - Magnum Pouch': MENS_MONTHLY,
	'Boxers - Trunk': MENS_MONTHLY,
	'Boxers - Cooling': MENS_MONTHLY,
	'Boxers Loose': MENS_MONTHLY,
	'Briefs': MENS_MONTHLY,
	'Trunks': MENS_MONTHLY,

	"Men's T-Shirts": TSHIRT_MONTHLY,

	'Laundry Detergent Sheets': LAUNDRY_MONTHLY,

	// Socks display "any 3 for $33" — handled separately, not a per-item price
	'Socks - Ankle': null,
	'Socks - Crew': null,
	'Socks - Quarter': null,
};

/**
 * Returns the monthly subscription price for a product, or null if not subscribable.
 *
 * @param {string} productType   - product.productType from the formatted product
 * @param {string[]} tags        - product.tags array (lowercased by the formatter)
 * @returns {number|null}
 */
export function getSubscriptionMonthlyPrice(productType, tags = []) {
	// The storefront only shows the subscription price when the product is tagged
	// "Show Subscribe Option" — the formatter lowercases tags.
	const isSubscribable = tags.some(
		(t) => t.toLowerCase() === 'show subscribe option',
	);
	if (!isSubscribable) return null;

	return SUBSCRIPTION_MONTHLY_BY_TYPE[productType] ?? null;
}

/**
 * Returns whether the product type uses the socks promo ("any 3 for $33")
 * instead of a per-item subscription price.
 */
export function isSocksType(productType) {
	return productType?.toLowerCase().includes('sock');
}
