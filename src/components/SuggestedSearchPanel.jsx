import { useSuggestedSearch } from '../hooks/useSuggestedSearch';
import styles from './SuggestedSearchPanel.module.css';

const CATEGORY_ICONS = {
	trending: '🔥',
	suggestion: '🔍',
};

function TermPill({ term, rank, onClick }) {
	return (
		<button className={styles.pill} onClick={() => onClick(term)}>
			{rank !== undefined && <span className={styles.rank}>#{rank + 1}</span>}
			{term}
		</button>
	);
}

function SuggestionRow({ term, query, onClick }) {
	// Bold the matching prefix
	const lower = term.toLowerCase();
	const matchLen = lower.startsWith(query.toLowerCase()) ? query.length : 0;
	return (
		<button className={styles.suggestionRow} onClick={() => onClick(term)}>
			<span className={styles.suggestionIcon}>{CATEGORY_ICONS.suggestion}</span>
			<span className={styles.suggestionText}>
				{matchLen > 0 ? (
					<>
						<strong>{term.slice(0, matchLen)}</strong>
						{term.slice(matchLen)}
					</>
				) : term}
			</span>
		</button>
	);
}

export default function SuggestedSearchPanel({ onSearch }) {
	const {
		trendingTerms, trendingStatus,
		query, setQuery,
		suggestions, suggestStatus,
	} = useSuggestedSearch();

	const handleClick = (term) => {
		if (onSearch) onSearch(term);
	};

	const showSuggestions = query.trim().length > 0;

	return (
		<div className={styles.wrap}>
			<div className={styles.intro}>
				<h2 className={styles.title}>Suggested Search</h2>
				<p className={styles.sub}>
					Two Searchspring endpoints in one view:{' '}
					<code>GET /api/suggest/trending</code> for popularity-ranked terms, and{' '}
					<code>GET /api/search/autocomplete.json?suggestions=true</code> for
					live query suggestions as you type. Click any term to trigger a search.
				</p>
			</div>

			<div className={styles.columns}>

				{/* ── Left: Trending ────────────────────────────────────── */}
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionIcon}>{CATEGORY_ICONS.trending}</span>
						<div>
							<div className={styles.sectionTitle}>Trending Searches</div>
							<div className={styles.sectionEndpoint}>GET /api/suggest/trending</div>
						</div>
						<span className={`${styles.badge} ${styles.badgeTrending}`}>Live</span>
					</div>

					{trendingStatus === 'loading' && (
						<div className={styles.loading}><div className={styles.spinner} /> Fetching trending…</div>
					)}
					{trendingStatus === 'error' && (
						<div className={styles.error}>Failed to load trending searches.</div>
					)}
					{trendingStatus === 'success' && trendingTerms.length === 0 && (
						<div className={styles.empty}>No trending terms returned.</div>
					)}
					{trendingStatus === 'success' && trendingTerms.length > 0 && (
						<>
							<div className={styles.pillsGrid}>
								{trendingTerms.map((t, i) => (
									<TermPill key={i} rank={i} term={t.searchQuery} onClick={handleClick} />
								))}
							</div>

							{/* Bar chart visualising relative popularity */}
							<div className={styles.chartWrap}>
								<div className={styles.chartTitle}>Popularity</div>
								{trendingTerms.slice(0, 8).map((t, i) => {
									const max = trendingTerms[0]?.popularity || 1;
									const pct = Math.max(4, Math.round(((t.popularity || max - i) / max) * 100));
									return (
										<div className={styles.chartRow} key={i}>
											<span className={styles.chartLabel}>{t.searchQuery}</span>
											<div className={styles.chartBarWrap}>
												<div className={styles.chartBar} style={{ width: `${pct}%` }} />
												<span className={styles.chartPct}>{pct}%</span>
											</div>
										</div>
									);
								})}
							</div>
						</>
					)}
				</section>

				{/* ── Right: Live Suggestions ────────────────────────────── */}
				<section className={styles.section}>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionIcon}>{CATEGORY_ICONS.suggestion}</span>
						<div>
							<div className={styles.sectionTitle}>Live Query Suggestions</div>
							<div className={styles.sectionEndpoint}>GET /api/search/autocomplete.json?suggestions=true</div>
						</div>
						<span className={`${styles.badge} ${styles.badgeSuggest}`}>250ms debounce</span>
					</div>

					<div className={styles.inputWrap}>
						<svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
						</svg>
						<input
							className={styles.input}
							placeholder="Start typing to see suggestions…"
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{suggestStatus === 'loading' && <div className={styles.inputSpinner} />}
						{query && (
							<button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
						)}
					</div>

					{!showSuggestions && (
						<div className={styles.idle}>
							<p>Type a partial query to see Searchspring's real-time suggestions.</p>
							<p className={styles.idleExamples}>
								Try: <button className={styles.exampleBtn} onClick={() => setQuery('box')}>box</button>
								<button className={styles.exampleBtn} onClick={() => setQuery('men')}>men</button>
								<button className={styles.exampleBtn} onClick={() => setQuery('polo')}>polo</button>
								<button className={styles.exampleBtn} onClick={() => setQuery('swim')}>swim</button>
							</p>
						</div>
					)}

					{showSuggestions && suggestStatus === 'empty' && (
						<div className={styles.empty}>No suggestions for &ldquo;{query}&rdquo;</div>
					)}

					{showSuggestions && suggestions.length > 0 && (
						<div className={styles.suggestionsList}>
							{suggestions.map((s, i) => (
								<SuggestionRow
									key={i}
									query={query}
									term={s.text || s}
									onClick={handleClick}
								/>
							))}
						</div>
					)}

					{/* Raw response metadata */}
					{showSuggestions && suggestions.length > 0 && (
						<div className={styles.meta}>
							<span className={styles.metaItem}>
								<span className={styles.metaDot} />
								{suggestions.length} suggestions returned
							</span>
							<span className={styles.metaItem}>
								<span className={styles.metaDot} />
								query: <code>{query}</code>
							</span>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
