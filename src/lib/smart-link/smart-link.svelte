<script lang="ts">
	import { TextLink } from './text-link.styles';

	let href: string;
	let as: string;
	let isExternal: boolean;
	let className: string;
</script>

<a
	href={as || href}
	class={[className, TextLink].join(' ')}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<slot />
</a>
