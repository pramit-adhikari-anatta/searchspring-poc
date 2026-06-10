import { useEffect, useRef, useState } from 'react';

import { autocomplete, trending } from '../services/api';

export const useSuggestedSearch = () => {
	// Trending — fetched once on mount
	const [trendingTerms, setTrendingTerms] = useState([]);
	const [trendingStatus, setTrendingStatus] = useState('idle');

	useEffect(() => {
		setTrendingStatus('loading');
		trending()
			.then((data) => {
				setTrendingTerms(data?.queries || []);
				setTrendingStatus('success');
			})
			.catch(() => setTrendingStatus('error'));
	}, []);

	// Inline suggestions — debounced on query change
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [suggestStatus, setSuggestStatus] = useState('idle');
	const timer = useRef(null);

	useEffect(() => {
		if (!query.trim()) {
			setSuggestions([]);
			setSuggestStatus('idle');
			return;
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(async () => {
			setSuggestStatus('loading');
			try {
				const raw = await autocomplete({
					q: query,
					perPage: 0,           // products not needed here
					includeSuggestions: true,
				});
				// raw.suggested.queries is the suggestions array
				const terms = raw?.suggested?.queries || [];
				setSuggestions(terms);
				setSuggestStatus(terms.length ? 'success' : 'empty');
			} catch {
				setSuggestStatus('error');
			}
		}, 250);
		return () => clearTimeout(timer.current);
	}, [query]);

	return {
		trendingTerms,
		trendingStatus,
		query,
		setQuery,
		suggestions,
		suggestStatus,
	};
};
