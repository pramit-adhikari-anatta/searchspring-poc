import { useState } from 'react';

import { useSimilarPrints } from '../hooks/useSimilarPrints';
import ProductCard from './ProductCard';
import styles from './SimilarPrintsPanel.module.css';

// Product types mapped from storefront services/searchspring/similarPrints.js collections map
const PRODUCT_TYPES = [
	'',
	'Boxers',
	'Briefs',
	'Boxers - Fly',
	'Boxers - Long - Fly',
	'Boxers - Cooling',
	'Trunks',
	'Boxers Loose',
	'Bikini',
	'Boyshort',
	'Seamless Boyshort',
	"Women's Boxer",
	'Cheeky',
	'Thongs',
	'Thongs - Modal',
	'Thongs - Cooling',
	'Bralettes',
	'Bralettes - Triangle',
	"Men's T-Shirts",
	"Men's Shorts",
	'Dresses',
	'Long Johns',
	'Ski Suits',
	'Lounge Mens Hoodie',
	'Lounge Mens Jogger',
	'Lounge Womens Hoodie',
	'Lounge Womens Jogger',
	'Sleep Mens Tops',
	'Sleep Mens Bottoms',
	'Sleep Womens Dress',
	'Sleep Womens Sets',
	'Boys Underwear',
	'Socks - Ankle',
	'Socks - Crew',
	'Socks - Quarter',
];

export default function SimilarPrintsPanel() {
	const [print, setPrint] = useState('');
	const [productType, setProductType] = useState('');
	const [size, setSize] = useState('');
	const { result, status, error, run } = useSimilarPrints();

	const handleRun = () => {
		if (!print && !productType) return;
		run({ print: print ? `print: ${print}` : '', productType, size });
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.intro}>
				<h2 className={styles.title}>Similar Prints Search</h2>
				<p className={styles.sub}>
					Finds products sharing the same print/pattern across product types. Mirrors the{' '}
					<code>getSimilarPrints()</code> logic from the storefront — filtering by{' '}
					<code>filter.tags</code> (print tag), <code>filter.product_type</code>, and optionally{' '}
					<code>filter.ss_size</code>.
				</p>
			</div>

			<div className={styles.controls}>
				<label className={styles.field}>
					<span className={styles.label}>Print name</span>
					<span className={styles.hint}>Stored as a Shopify tag — e.g. &quot;flamingo&quot; → tag &quot;print: flamingo&quot;</span>
					<div className={styles.printInputWrap}>
						<span className={styles.printPrefix}>print:</span>
						<input
							className={styles.printInput}
							placeholder="flamingo"
							type="text"
							value={print}
							onChange={(e) => setPrint(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleRun()}
						/>
					</div>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Product type</span>
					<span className={styles.hint}>Filters results to one product category</span>
					<select
						className={styles.select}
						value={productType}
						onChange={(e) => setProductType(e.target.value)}>
						{PRODUCT_TYPES.map((t) => (
							<option key={t} value={t}>{t || 'All types'}</option>
						))}
					</select>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Size (optional)</span>
					<span className={styles.hint}>Filter by <code>ss_size</code> field</span>
					<input
						className={styles.input}
						placeholder="e.g. S, M, L, XL"
						type="text"
						value={size}
						onChange={(e) => setSize(e.target.value)}
					/>
				</label>

				<button
					className={styles.btn}
					disabled={(!print && !productType) || status === 'loading'}
					onClick={handleRun}>
					{status === 'loading' ? 'Searching…' : 'Find Similar Prints'}
				</button>
			</div>

			{/* Active filters display */}
			{(print || productType || size) && (
				<div className={styles.activeFilters}>
					<span className={styles.filtersLabel}>Active filters:</span>
					{print && <span className={styles.tag}>print: {print}</span>}
					{productType && <span className={styles.tag}>{productType}</span>}
					{size && <span className={styles.tag}>size: {size}</span>}
				</div>
			)}

			{status === 'idle' && (
				<div className={styles.empty}>
					<span className={styles.emptyIcon}>🎨</span>
					<p>Enter a print name or product type to find similar items.</p>
				</div>
			)}

			{status === 'loading' && (
				<div className={styles.loading}>
					<div className={styles.spinner} />
					<span>Finding similar prints…</span>
				</div>
			)}

			{error && <div className={styles.error}>{error}</div>}

			{status === 'success' && (
				<>
					<div className={styles.meta}>
						<span className={styles.count}>
							{result.results.length} product{result.results.length !== 1 ? 's' : ''} found
						</span>
						{result.pagination.totalResults > result.results.length && (
							<span className={styles.note}>
								({result.pagination.totalResults} total before product-type filter)
							</span>
						)}
					</div>
					{result.results.length === 0 ? (
						<div className={styles.empty}>
							<span className={styles.emptyIcon}>⊘</span>
							<p>No products found for this print + type combination.</p>
						</div>
					) : (
						<div className={styles.grid}>
							{result.results.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
