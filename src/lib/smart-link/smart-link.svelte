<script lang="ts">
	import { css } from '@emotion/css';

	import { TextLink } from './text-link.styles';

	export let href: string;
	export let isExternal = false;
	export let className = '';
</script>

<a
	{href}
	class={css([TextLink, className])}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<slot />
</a>
