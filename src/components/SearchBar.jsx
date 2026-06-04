import { useRef } from 'react';

import { useAutocomplete } from '../hooks/useAutocomplete';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
	const { query, setQuery, suggestions, products, open, setOpen } = useAutocomplete();
	const inputRef = useRef(null);

	const commit = (q) => {
		setOpen(false);
		onSearch(q || query);
		inputRef.current?.blur();
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.inputRow}>
				<svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
				</svg>
				<input
					ref={inputRef}
					className={styles.input}
					placeholder="Search products…"
					type="search"
					value={query}
					onBlur={() => setTimeout(() => setOpen(false), 150)}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => query && setOpen(true)}
					onKeyDown={(e) => e.key === 'Enter' && commit()}
				/>
				{query && (
					<button className={styles.clear} onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
						✕
					</button>
				)}
				<button className={styles.btn} onClick={() => commit()}>Search</button>
			</div>

			{open && (suggestions.length > 0 || products.length > 0) && (
				<div className={styles.dropdown}>
					{suggestions.length > 0 && (
						<div className={styles.section}>
							<div className={styles.sectionLabel}>Suggestions</div>
							{suggestions.slice(0, 5).map((s, i) => (
								<button
									className={styles.suggestion}
									key={i}
									onMouseDown={() => commit(s.text || s)}>
									<svg fill="none" height={14} stroke="currentColor" viewBox="0 0 24 24" width={14}>
										<path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
									</svg>
									{s.text || s}
								</button>
							))}
						</div>
					)}

					{products.length > 0 && (
						<div className={styles.section}>
							<div className={styles.sectionLabel}>Products</div>
							{products.map((p) => (
								<a
									className={styles.productRow}
									href={`/products/${p.handle}`}
									key={p.id}
									rel="noreferrer"
									target="_blank">
									{p.imageSrc && (
										<img alt={p.imageAlt} className={styles.thumb} src={p.imageSrc} />
									)}
									<div className={styles.productInfo}>
										<span className={styles.productTitle}>{p.title}</span>
										<span className={styles.productPrice}>
											{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}
										</span>
									</div>
								</a>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
