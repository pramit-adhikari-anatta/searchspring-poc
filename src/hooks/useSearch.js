import { useCallback, useEffect, useReducer } from 'react'; // useEffect used for auto-run on state change

import { search } from '../services/api';

const SORT_OPTIONS = {
	'Most Relevant': {},
	'Price: Low → High': { field: 'ss_price', direction: 'asc' },
	'Price: High → Low': { field: 'ss_price', direction: 'desc' },
	Newest: { field: 'created_at', direction: 'desc' },
	'Best Selling': { field: 'sales_rank', direction: 'desc' },
};

const init = {
	q: '',
	collectionHandle: '',
	sortLabel: 'Most Relevant',
	page: 1,
	selectedFacets: {},
	result: null,
	status: 'idle',
	error: null,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_QUERY':
			return { ...state, q: action.payload, page: 1 };
		case 'SET_COLLECTION':
			return { ...state, collectionHandle: action.payload, page: 1 };
		case 'SET_SORT':
			return { ...state, sortLabel: action.payload, page: 1 };
		case 'SET_PAGE':
			return { ...state, page: action.payload };
		case 'TOGGLE_FACET': {
			const { key, value } = action.payload;
			const current = state.selectedFacets[key] || [];
			const next = current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value];
			return {
				...state,
				selectedFacets: next.length ? { ...state.selectedFacets, [key]: next } : (() => {
					const f = { ...state.selectedFacets };
					delete f[key];
					return f;
				})(),
				page: 1,
			};
		}
		case 'CLEAR_FACETS':
			return { ...state, selectedFacets: {}, page: 1 };
		case 'LOADING':
			return { ...state, status: 'loading', error: null };
		case 'SUCCESS':
			return { ...state, status: 'success', result: action.payload };
		case 'ERROR':
			return { ...state, status: 'error', error: action.payload };
		default:
			return state;
	}
};

export const useSearch = () => {
	const [state, dispatch] = useReducer(reducer, init);

	const run = useCallback(async () => {
		dispatch({ type: 'LOADING' });
		try {
			const sort = SORT_OPTIONS[state.sortLabel];
			const filters = Object.fromEntries(
				Object.entries(state.selectedFacets).map(([k, v]) => [k, v])
			);
			const result = await search({
				q: state.q,
				collectionHandle: state.collectionHandle,
				sort,
				page: state.page,
				filters,
				selectedFacets: state.selectedFacets,
			});
			dispatch({ type: 'SUCCESS', payload: result });
		} catch (e) {
			dispatch({ type: 'ERROR', payload: e.message });
		}
	}, [state.q, state.collectionHandle, state.sortLabel, state.page, state.selectedFacets]);

	useEffect(() => {
		if (state.q || state.collectionHandle) run();
	}, [run]);

	return {
		...state,
		sortOptions: Object.keys(SORT_OPTIONS),
		setQuery: (v) => dispatch({ type: 'SET_QUERY', payload: v }),
		setCollection: (v) => dispatch({ type: 'SET_COLLECTION', payload: v }),
		setSort: (v) => dispatch({ type: 'SET_SORT', payload: v }),
		setPage: (v) => dispatch({ type: 'SET_PAGE', payload: v }),
		toggleFacet: (key, value) => dispatch({ type: 'TOGGLE_FACET', payload: { key, value } }),
		clearFacets: () => dispatch({ type: 'CLEAR_FACETS' }),
		runSearch: run,
	};
};
