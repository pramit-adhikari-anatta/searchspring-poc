import styles from './Facets.module.css';

export default function Facets({ facets, selectedFacets, onToggle, onClear }) {
	const hasActive = Object.values(selectedFacets).some((v) => v.length > 0);

	if (!facets?.length) return null;

	return (
		<aside className={styles.aside}>
			<div className={styles.header}>
				<span className={styles.title}>Filters</span>
				{hasActive && (
					<button className={styles.clearAll} onClick={onClear}>
						Clear all
					</button>
				)}
			</div>

			{facets.map((facet) => (
				<div className={styles.group} key={facet.key}>
					<div className={styles.groupLabel}>{facet.label}</div>
					<div className={styles.values}>
						{facet.values.map((v) => (
							<label className={styles.value} key={v.label}>
								<input
									checked={v.selected}
									className={styles.checkbox}
									type="checkbox"
									onChange={() => onToggle(facet.key, v.label)}
								/>
								<span className={styles.valueLabel}>{v.label}</span>
								<span className={styles.count}>{v.count}</span>
							</label>
						))}
					</div>
				</div>
			))}
		</aside>
	);
}
