<script lang="ts">
	import { NavLinkWrapper } from './navigation.styles';

	export let isActive: boolean | undefined = false;
	export let href: string;
</script>

<a class={NavLinkWrapper(isActive)} {href}>
	<slot />
</a>
