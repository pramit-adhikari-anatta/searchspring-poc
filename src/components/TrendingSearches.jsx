import { useEffect, useState } from 'react';

import { trending } from '../services/api';
import styles from './TrendingSearches.module.css';

export default function TrendingSearches({ onSearch }) {
	const [terms, setTerms] = useState([]);
	const [status, setStatus] = useState('idle');

	useEffect(() => {
		setStatus('loading');
		trending()
			.then((data) => { setTerms(data?.queries || []); setStatus('success'); })
			.catch(() => setStatus('error'));
	}, []);

	if (status === 'loading') return <div className={styles.loading}>Loading trending searches…</div>;
	if (!terms.length) return null;

	return (
		<div className={styles.wrap}>
			<span className={styles.label}>Trending:</span>
			{terms.slice(0, 8).map((t, i) => (
				<button
					className={styles.pill}
					key={i}
					onClick={() => onSearch(t.searchQuery)}>
					{t.searchQuery}
				</button>
			))}
		</div>
	);
}
