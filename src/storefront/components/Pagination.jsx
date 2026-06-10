/**
 * Ported from /components/Pagination.js in the main storefront.
 * Dependency removed: IconUpdated → inline SVG carets.
 */
import classNames from '../utils/class-names';

const CaretLeft = () => (
	<svg fill="none" height="14" stroke="currentColor" viewBox="0 0 24 24" width="14">
		<path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
	</svg>
);

const CaretRight = () => (
	<svg fill="none" height="14" stroke="currentColor" viewBox="0 0 24 24" width="14">
		<path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
	</svg>
);

export default function Pagination({ page = 1, numberOfPages = 1, onChange }) {
	if (numberOfPages <= 1) return null;

	let pageArray = [];
	if (numberOfPages < 8) {
		pageArray = Array.from({ length: numberOfPages }, (_, i) => i + 1);
	} else {
		pageArray.push(1);
		let start = page - 3 > 1 ? page - 3 : 2;
		if (start > 2) pageArray.push('...');
		let end = page + 3 > numberOfPages - 1 ? numberOfPages - 1 : page + 3;
		for (let i = start; i <= end; i++) pageArray.push(i);
		if (end + 1 < numberOfPages) pageArray.push('...');
		pageArray.push(numberOfPages);
	}

	const btnBase =
		'outline-none rounded-full ml-1 h-11 w-11 hover:bg-gray-200 active:bg-gray-200 focus:shadow-inner shadow-primary-500/50';

	return (
		<div className="flex justify-center py-6">
			{page !== 1 && (
				<button
					className={classNames(btnBase, 'text-primary flex justify-center items-center')}
					title="previous page"
					onClick={() => onChange(page - 1)}>
					<CaretLeft />
				</button>
			)}
			<div className="flex-1 flex flex-wrap items-center justify-center max-w-max">
				{pageArray.map((num, i) => (
					<button
						key={`${i}-${num}`}
						className={classNames(
							btnBase,
							page === num && 'border-2 text-primary font-semibold border-primary pt-[5px]',
						)}
						disabled={num === '...'}
						title={num === '...' ? undefined : `page ${num}`}
						onClick={() => typeof num === 'number' && onChange(num)}>
						{num}
					</button>
				))}
			</div>
			{page !== numberOfPages && (
				<button
					className={classNames(btnBase, 'text-primary flex justify-center items-center')}
					title="next page"
					onClick={() => onChange(page + 1)}>
					<CaretRight />
				</button>
			)}
		</div>
	);
}
