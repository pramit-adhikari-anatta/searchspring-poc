/**
 * Ported from /components/Stars.js in the main storefront.
 * Dependency removed: IconUpdated — replaced with inline SVG stars.
 */
const FullStar = ({ size }) => (
	<svg height={size} viewBox="0 0 24 24" width={size} fill="#d53e27">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

const HalfStar = ({ size }) => (
	<svg height={size} viewBox="0 0 24 24" width={size}>
		<defs>
			<linearGradient id="half">
				<stop offset="50%" stopColor="#d53e27" />
				<stop offset="50%" stopColor="#d1d5db" />
			</linearGradient>
		</defs>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half)" />
	</svg>
);

const EmptyStar = ({ size }) => (
	<svg height={size} viewBox="0 0 24 24" width={size} fill="#d1d5db">
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

const sizeMap = { large: '24px', normal: '18px', small: '11px' };

export default function Stars({ rating = 0, totalStars = 5, variant = 'normal' }) {
	const size = sizeMap[variant] || sizeMap.normal;
	const full = Math.floor(rating);
	const decimal = rating - full;
	const hasHalf = decimal >= 0.33 && decimal < 0.8;
	const roundUp = decimal >= 0.8;
	const effectiveFull = roundUp ? full + 1 : full;

	const items = Array.from({ length: totalStars }, (_, i) => {
		if (i < effectiveFull) return <FullStar key={i} size={size} />;
		if (i === effectiveFull && hasHalf) return <HalfStar key={i} size={size} />;
		return <EmptyStar key={i} size={size} />;
	});

	return <div className="flex items-center gap-0.5">{items}</div>;
}
