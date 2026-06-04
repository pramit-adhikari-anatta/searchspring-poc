import { useEffect, useState } from 'react';

import { recommend } from '../services/api';

export const useRecommendations = ({ productIds, profile = 'product-page', limit = 4 }) => {
	const [products, setProducts] = useState([]);
	const [status, setStatus] = useState('idle');
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!productIds?.length) return;
		let cancelled = false;
		setStatus('loading');
		recommend({ productIds, profile, limit })
			.then((data) => { if (!cancelled) { setProducts(data); setStatus('success'); } })
			.catch((e) => { if (!cancelled) { setError(e.message); setStatus('error'); } });
		return () => { cancelled = true; };
	}, [JSON.stringify(productIds), profile, limit]);

	return { products, status, error };
};
