import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
		if (totalPages <= 7) return i + 1;
		if (currentPage <= 4) return i + 1;
		if (currentPage >= totalPages - 3) return totalPages - 6 + i;
		return currentPage - 3 + i;
	});

	return (
		<div className={styles.wrap}>
			<button
				className={styles.btn}
				disabled={currentPage <= 1}
				onClick={() => onPageChange(currentPage - 1)}>
				← Prev
			</button>

			{pages[0] > 1 && (
				<>
					<button className={styles.btn} onClick={() => onPageChange(1)}>1</button>
					{pages[0] > 2 && <span className={styles.ellipsis}>…</span>}
				</>
			)}

			{pages.map((p) => (
				<button
					className={`${styles.btn} ${p === currentPage ? styles.active : ''}`}
					key={p}
					onClick={() => onPageChange(p)}>
					{p}
				</button>
			))}

			{pages[pages.length - 1] < totalPages && (
				<>
					{pages[pages.length - 1] < totalPages - 1 && <span className={styles.ellipsis}>…</span>}
					<button className={styles.btn} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
				</>
			)}

			<button
				className={styles.btn}
				disabled={currentPage >= totalPages}
				onClick={() => onPageChange(currentPage + 1)}>
				Next →
			</button>
		</div>
	);
}
