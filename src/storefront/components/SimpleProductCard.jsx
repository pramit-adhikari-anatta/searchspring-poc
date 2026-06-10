/**
 * Ported from /components/product-card/ProductCard.js + SimpleProductCard.js
 * in the main storefront, targeting the live Shinesty collection page layout.
 *
 * Shows (in order, matching shinesty.com product cards):
 *   1. Product image  — aspect-square, hover scale, rounded, discount badge
 *   2. Title          — Typography body / semibold
 *   3. Stars + review count  — always rendered; shows "No reviews" when empty
 *   4. Description    — Typography micro, truncated
 *   5. Price row      — compare-at (strike-through) + sale price in red
 *   6. Subscription   — "($X.XX On Subscription)" in primary red when tagged
 *
 * Dependencies shimmed:
 *   - next/link             → storefront/shims/Link
 *   - /components/Price     → storefront/components/Price
 *   - /components/Typography → storefront/components/Typography
 *   - /components/Stars     → storefront/components/Stars
 * Dependency added:
 *   - /services/subscriptions → src/services/subscriptions (POC-local lookup)
 */
import { getSubscriptionMonthlyPrice, isSocksType } from '../../services/subscriptions';
import { getProductSticker } from '../../services/productSticker';
import Link from '../shims/Link';
import Price from './Price';
import Stars from './Stars';
import Typography from './Typography';

export default function SimpleProductCard({ product, onClick }) {
	const {
		compareAtPrice,
		description,
		handle,
		imageAlt,
		imageSrc,
		price,
		productType,
		rating,
		ratingCount,
		tags,
		title,
	} = product;

	const hasDiscount = compareAtPrice > price;
	const savingsPct = hasDiscount
		? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
		: 0;

	// Sticker overlay — mirrors getProductSticker() from the storefront
	const sticker = getProductSticker({ productType, tags });

	// Subscription pricing — mirrors ProductCardBanner logic
	const subMonthlyPrice = getSubscriptionMonthlyPrice(productType, tags);
	const showSocksPromo = isSocksType(productType) && tags?.some(
		(t) => t.toLowerCase() === 'show subscribe option',
	);

	// Review display — mirrors ProductCard stars row
	const hasReviews = ratingCount > 0;
	const reviewLabel = hasReviews
		? `${ratingCount > 1000 ? `${(ratingCount / 1000).toFixed()}k` : ratingCount} ${ratingCount === 1 ? 'Review' : 'Reviews'}`
		: 'No reviews';

	return (
		<Link className="group block" href={`/products/${handle}`} onClick={onClick}>

			{/* ── 1. Image ────────────────────────────────────────────── */}
			<div className="aspect-square overflow-hidden rounded-md bg-v2-off-white relative">
				{imageSrc ? (
					<img
						alt={imageAlt || title}
						className="h-full w-full object-cover group-hover:opacity-75 transition-opacity duration-200"
						loading="lazy"
						src={imageSrc}
					/>
				) : (
					<div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
						No image
					</div>
				)}
				{hasDiscount && (
					<span className="absolute top-2 left-2 bg-primary text-white rounded-full px-2 py-0.5 text-[10px] font-bold leading-none">
						{savingsPct}% OFF
					</span>
				)}
				{/* Feature sticker — top-right, matches storefront h-[64px] w-[64px] positioning */}
				{sticker && (
					<div className="absolute right-0 top-0 z-10 h-[64px] w-[64px]">
						<img
							alt="product feature"
							className="h-full w-full object-contain"
							loading="lazy"
							src={sticker}
						/>
					</div>
				)}
			</div>

			{/* ── 2–6. Card body ──────────────────────────────────────── */}
			<div className="mx-0 pt-2 text-left">

				{/* 2. Title */}
				<Typography className="font-semibold mt-1 text-v2-brown-darker" component="h2" variant="body">
					{title}
				</Typography>

				{/* 3. Stars + review count — always shown */}
				<div className="flex items-center pt-1 gap-1">
					{hasReviews && <Stars rating={rating} variant="small" />}
					<Typography
						className="mt-0.5 whitespace-nowrap text-v2-brown"
						variant="small">
						{reviewLabel}
					</Typography>
				</div>

				{/* 4. Description */}
				{description && (
					<Typography
						className="mt-1 text-v2-brown-darker h-6 truncate"
						component="p"
						variant="micro">
						{description}
					</Typography>
				)}

				{/* 5. Price row */}
				<div className="mt-1 text-v2-brown-darker md:flex items-center gap-2">
					{hasDiscount && (
						<span aria-hidden="true" className="line-through text-gray-500 italic mr-1 text-sm">
							<Price price={compareAtPrice} showSymbol />
						</span>
					)}
					<span className={hasDiscount ? 'text-primary font-semibold' : ''}>
						<Price price={price} showSymbol />
					</span>
				</div>

				{/* 6. Subscription price — mirrors ProductCardBanner */}
				{showSocksPromo && (
					<Typography className="text-primary" component="p" variant="small">
						Or any 3 for $33
					</Typography>
				)}
				{subMonthlyPrice && !showSocksPromo && (
					<Typography className="text-primary" component="p" variant="small">
						(<Price price={subMonthlyPrice} showSymbol /> On Subscription)
					</Typography>
				)}
			</div>
		</Link>
	);
}
