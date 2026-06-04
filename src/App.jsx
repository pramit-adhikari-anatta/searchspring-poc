import { useState } from 'react';

import Facets from './components/Facets';
import Pagination from './components/Pagination';
import ProductCard from './components/ProductCard';
import RecommendationsPanel from './components/RecommendationsPanel';
import SearchBar from './components/SearchBar';
import SimilarPrintsPanel from './components/SimilarPrintsPanel';
import TrendingSearches from './components/TrendingSearches';
import { useRecommendations } from './hooks/useRecommendations';
import { useSearch } from './hooks/useSearch';
import styles from './App.module.css';

const TABS = [
	{ id: 'search', label: 'Search & Browse', icon: '🔍' },
	{ id: 'recommendations', label: 'Recommendations', icon: '✦' },
	{ id: 'similar-prints', label: 'Similar Prints', icon: '🎨' },
];

// ── Inline recs strip shown when a product card is clicked ────────────────────
function RecsStrip({ productIds }) {
	const { products, status } = useRecommendations({ productIds, limit: 6 });
	if (!productIds?.length || status === 'idle') return null;
	return (
		<section className={styles.recsSection}>
			<h2 className={styles.recsTitle}>You Might Also Like</h2>
			{status === 'loading' && <div className={styles.spinner} />}
			{status === 'success' && products.length > 0 && (
				<div className={styles.recsGrid}>
					{products.map((p) => <ProductCard key={p.id} product={p} />)}
				</div>
			)}
		</section>
	);
}

// ── Search tab — receives pre-lifted search state from App ────────────────────
function SearchTab({ search }) {
	const { result, status, error, page, selectedFacets, sortOptions, sortLabel,
		setSort, setPage, toggleFacet, clearFacets } = search;
	const [selectedIds, setSelectedIds] = useState([]);

	const toggleId = (id) =>
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev].slice(0, 3)
		);

	return (
		<div className={styles.searchTab}>
			{status === 'idle' && (
				<div className={styles.empty}>
					<span className={styles.emptyIcon}>🔍</span>
					<p>Search for products above, or enter a collection handle to browse.</p>
				</div>
			)}
			{status === 'loading' && !result && (
				<div className={styles.loadingFull}>
					<div className={styles.spinner} />
					<span>Searching…</span>
				</div>
			)}
			{error && <div className={styles.error}>{error}</div>}
			{result && (
				<>
					<div className={styles.toolbar}>
						<span className={styles.resultCount}>
							{result.pagination.totalResults.toLocaleString()} results
							{result.didYouMean && <> — showing results for <em>{result.didYouMean}</em></>}
						</span>
						<select className={styles.sortSelect} value={sortLabel} onChange={(e) => setSort(e.target.value)}>
							{sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
						</select>
					</div>
					<div className={styles.layout}>
						{result.facets?.length > 0 && (
							<Facets facets={result.facets} selectedFacets={selectedFacets}
								onClear={clearFacets} onToggle={toggleFacet} />
						)}
						<div className={styles.main}>
							{status === 'loading' && (
								<div className={styles.loadingOverlay}><div className={styles.spinner} /></div>
							)}
							<div className={styles.grid}>
								{result.results.map((p) => (
									<div
										className={`${styles.cardWrap} ${selectedIds.includes(p.id) ? styles.selected : ''}`}
										key={p.id}
										title="Click to load recommendations"
										onClick={() => toggleId(p.id)}>
										<ProductCard product={p} />
									</div>
								))}
							</div>
							<Pagination currentPage={page} totalPages={result.pagination.totalPages} onPageChange={setPage} />
						</div>
					</div>
					<RecsStrip productIds={selectedIds} />
				</>
			)}
		</div>
	);
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
	const [activeTab, setActiveTab] = useState('search');
	const [collectionInput, setCollectionInput] = useState('');

	// Single useSearch instance — shared between App header controls and SearchTab
	const search = useSearch();

	const handleSearch = (q) => {
		setActiveTab('search');
		search.setQuery(q);
	};

	const handleBrowse = () => {
		setActiveTab('search');
		search.setCollection(collectionInput);
		// setCollection triggers the useEffect in useSearch via its own dep tracking
	};

	return (
		<div className={styles.app}>
			<header className={styles.header}>
				<div className={styles.headerTop}>
					<span className={styles.logo}>Searchspring POC</span>
					<SearchBar onSearch={handleSearch} />
				</div>
				{activeTab === 'search' && (
					<div className={styles.collectionRow}>
						<TrendingSearches onSearch={handleSearch} />
						<div className={styles.collectionInputRow}>
							<input
								className={styles.collectionInput}
								placeholder="Browse a collection (e.g. mens-underwear)"
								type="text"
								value={collectionInput}
								onChange={(e) => setCollectionInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleBrowse()}
							/>
							<button className={styles.browseBtn} onClick={handleBrowse}>Browse</button>
						</div>
					</div>
				)}
			</header>

			<nav className={styles.tabBar}>
				{TABS.map((tab) => (
					<button
						className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}>
						<span className={styles.tabIcon}>{tab.icon}</span>
						{tab.label}
					</button>
				))}
			</nav>

			<main className={styles.content}>
				{activeTab === 'search' && <SearchTab search={search} />}
				{activeTab === 'recommendations' && <RecommendationsPanel />}
				{activeTab === 'similar-prints' && <SimilarPrintsPanel />}
			</main>
		</div>
	);
}
