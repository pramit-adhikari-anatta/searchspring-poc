/**
 * Shim for Next.js <Link> → plain <a> tag.
 * Allows storefront components to render in the Vite POC without Next.js.
 * Shopify porting: replace this file with the theme's routing mechanism.
 */
export default function Link({ href, children, passHref, className, onClick, ...rest }) {
	return (
		<a className={className} href={href} onClick={onClick} {...rest}>
			{children}
		</a>
	);
}
