<script lang="ts">
	import { css } from '@emotion/css';

	import { TextLink } from './text-link.styles';

	export let href: string;
	export let isExternal = false;
	let className = '';
	export { className as class };
</script>

<!-- class={css([TextLink, className])} -->
<a
	{href}
	class={[TextLink, className].join(' ')}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<slot />
</a>
