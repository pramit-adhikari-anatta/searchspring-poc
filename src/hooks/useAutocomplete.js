import { useEffect, useRef, useState } from 'react';

import { autocomplete } from '../services/api';
import { formatResponse } from '../services/formatter';

export const useAutocomplete = (delay = 300) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [products, setProducts] = useState([]);
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState('idle');
	const timer = useRef(null);

	useEffect(() => {
		if (!query.trim()) {
			setSuggestions([]);
			setProducts([]);
			setOpen(false);
			setStatus('idle');
			return;
		}

		clearTimeout(timer.current);
		timer.current = setTimeout(async () => {
			setStatus('loading');
			try {
				const raw = await autocomplete({ q: query });
				setSuggestions(raw?.suggested?.queries || []);
				setProducts(formatResponse(raw).results.slice(0, 6));
				setOpen(true);
				setStatus('success');
			} catch {
				setStatus('error');
			}
		}, delay);

		return () => clearTimeout(timer.current);
	}, [query, delay]);

	return { query, setQuery, suggestions, products, open, setOpen, status };
};
