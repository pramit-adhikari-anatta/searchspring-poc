/**
 * Shim for Next.js <Image> → standard <img> tag with lazy loading.
 * Allows storefront components to render in the Vite POC without Next.js.
 * Shopify porting: replace with Shopify's image_url filter or a CDN-aware component.
 */
export default function Image({ src, alt, className, width, height, objectFit = 'cover', ...rest }) {
	return (
		<img
			alt={alt || ''}
			className={className}
			height={height}
			loading="lazy"
			src={src}
			style={{ objectFit }}
			width={width}
			{...rest}
		/>
	);
}
