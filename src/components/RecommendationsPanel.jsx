import { useState } from 'react';

import { useRecommendations } from '../hooks/useRecommendations';
import { SimpleProductCard } from '../storefront/index';
import styles from './RecommendationsPanel.module.css';

const PROFILES = ['product-page', 'cross-sell', 'upsell', 'similar'];

export default function RecommendationsPanel() {
	const [inputIds, setInputIds] = useState('');
	const [profile, setProfile] = useState('product-page');
	const [limit, setLimit] = useState(8);
	const [submittedIds, setSubmittedIds] = useState([]);

	const { products, status, error } = useRecommendations({
		productIds: submittedIds,
		profile,
		limit,
	});

	const handleRun = () => {
		const ids = inputIds
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		setSubmittedIds(ids);
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.intro}>
				<h2 className={styles.title}>Product Recommendations</h2>
				<p className={styles.sub}>
					Calls <code>/boost/&#123;siteId&#125;/recommend</code> (POST) with a product ID list and a
					profile tag. Returns personalised recommendations powered by Searchspring's ML engine.
				</p>
			</div>

			<div className={styles.controls}>
				<label className={styles.field}>
					<span className={styles.label}>Searchspring Product ID(s)</span>
					<span className={styles.hint}>Comma-separated UIDs from any product in your catalog</span>
					<input
						className={styles.input}
						placeholder="e.g. 123456, 789012"
						type="text"
						value={inputIds}
						onChange={(e) => setInputIds(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleRun()}
					/>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Profile tag</span>
					<span className={styles.hint}>Must match a profile configured in your SS account</span>
					<select
						className={styles.select}
						value={profile}
						onChange={(e) => setProfile(e.target.value)}>
						{PROFILES.map((p) => (
							<option key={p} value={p}>{p}</option>
						))}
					</select>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Limit</span>
					<input
						className={`${styles.input} ${styles.narrow}`}
						max={20}
						min={1}
						type="number"
						value={limit}
						onChange={(e) => setLimit(parseInt(e.target.value) || 4)}
					/>
				</label>

				<button
					className={styles.btn}
					disabled={!inputIds.trim() || status === 'loading'}
					onClick={handleRun}>
					{status === 'loading' ? 'Loading…' : 'Get Recommendations'}
				</button>
			</div>

			{status === 'idle' && (
				<div className={styles.empty}>
					<span className={styles.emptyIcon}>✦</span>
					<p>Enter a product ID above to load recommendations.</p>
				</div>
			)}

			{status === 'loading' && (
				<div className={styles.loading}>
					<div className={styles.spinner} />
					<span>Fetching recommendations…</span>
				</div>
			)}

			{error && <div className={styles.error}>{error}</div>}

			{status === 'success' && (
				<>
					<div className={styles.meta}>
						<span className={styles.count}>{products.length} recommendations returned</span>
						<span className={styles.pill}>{profile}</span>
					</div>
					{products.length === 0 ? (
						<div className={styles.empty}>
							<span className={styles.emptyIcon}>⊘</span>
							<p>No recommendations returned. Try a different product ID or profile.</p>
						</div>
					) : (
						<div className={styles.grid}>
							{products.map((p) => (
								<SimpleProductCard key={p.id} product={p} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
