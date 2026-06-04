import { useState } from 'react';

import { similarPrints } from '../services/api';

export const useSimilarPrints = () => {
	const [result, setResult] = useState(null);
	const [status, setStatus] = useState('idle');
	const [error, setError] = useState(null);

	const run = async ({ print, productType, size }) => {
		setStatus('loading');
		setError(null);
		try {
			const data = await similarPrints({ print, productType, size });
			setResult(data);
			setStatus('success');
		} catch (e) {
			setError(e.message);
			setStatus('error');
		}
	};

	return { result, status, error, run };
};
