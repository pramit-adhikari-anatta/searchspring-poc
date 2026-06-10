/**
 * Ported from /components/Typography.js in the main storefront.
 * Dependency removed: prop-types (optional in Vite POC).
 */
const variantMap = {
	body: 'leading-[1.40rem] tracking-wider',
	'body-lg': 'text-lg leading-tighter tracking-wider',
	'body-heavy': 'text-base leading-snug tracking-wider font-bold',
	link: 'tracking-wider text-secondary underline underline-offset-2 hover:text-secondary-dark',
	'link-header': 'tracking-wider text-black hover:text-primary font-bold capitalize',
	micro: 'text-xs font-medium tracking-wider leading-tight',
	small: 'font-medium leading-4 text-sm tracking-wide',
	pretitle: 'font-bold capitalize text-sm tracking-wider',
	'heading-xl': 'font-bold leading-8 capitalize text-3xl lg:text-[3.5rem] tracking-widest',
	'heading-lg': 'font-bold leading-10 capitalize text-3xl lg:text-4xl tracking-wide',
	'heading-md': 'font-bold leading-5 capitalize text-lg tracking-widest lg:text-2xl lg:leading-7',
	'heading-sm': 'font-bold leading-6 capitalize tracking-widest',
	'heading-xs': 'font-bold leading-4 capitalize tracking-widest',
	'subhead-lg': 'font-bold leading-8 capitalize text-2xl lg:leading-10 lg:text-4xl',
	'subhead-md': 'font-bold leading-7 capitalize tracking-wide text-[28px]',
	'subtitle-lg': 'font-semibold leading-5 text-lg lg:leading-6 lg:text-xl',
	'subtitle-md': 'font-semibold leading-[1.40rem] md:leading-5 md:text-lg',
};

export default function Typography({ children, variant, component, className, font = 'lexend', ...rest }) {
	if (!children) return null;
	const fontClass = font === 'moret' ? 'font-moret' : 'font-lexend';
	const variantClass = variantMap[variant] || '';
	const Component = component || 'span';
	return (
		<Component className={[variantClass, fontClass, className].filter(Boolean).join(' ')} {...rest}>
			{children}
		</Component>
	);
}
