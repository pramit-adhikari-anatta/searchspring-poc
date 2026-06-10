import styles from './ProductCard.module.css';

const stars = (n) => '★'.repeat(Math.min(5, Math.round(n))) + '☆'.repeat(5 - Math.min(5, Math.round(n)));

const fmt = (n) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

export default function ProductCard({ product }) {
	const { title, description, imageSrc, imageAlt, price, compareAtPrice, rating, ratingCount, handle, productType } = product;
	const hasDiscount = compareAtPrice > price;

	return (
		<a className={styles.card} href={`/products/${handle}`} rel="noreferrer" target="_blank">
			<div className={styles.imageWrap}>
				{imageSrc
					? <img alt={imageAlt} className={styles.image} loading="lazy" src={imageSrc} />
					: <div className={styles.imagePlaceholder}>No image</div>
				}
				{hasDiscount && (
					<span className={styles.badge}>
						{Math.round((1 - price / compareAtPrice) * 100)}% OFF
					</span>
				)}
			</div>
			<div className={styles.body}>
				<div className={styles.title}>{title}</div>
				{description && <div className={styles.desc}>{description}</div>}
				<div className={styles.pricing}>
					<span className={styles.price}>{fmt(price)}</span> - 
					<span className={styles.price}>{fmt(compareAtPrice)}</span>
					{hasDiscount && <span className={styles.compare}>{fmt(compareAtPrice)}</span>}
				</div>
				{rating > 0 && (
					<div className={styles.rating}>
						<span className={styles.stars}>{stars(rating)}</span>
						<span className={styles.ratingCount}>({ratingCount})</span>
					</div>
				)}
			</div>
		</a>
	);
}
