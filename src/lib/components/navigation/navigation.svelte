<div class="navigation-wrapper max-w-screen-sm mx-auto px-4 mt-2">
	<label
		class="block text-2xl p-1 mb-2 bg-background rounded sm:hidden"
		for="navigation-menu-button"
	>
		☰
	</label>
	<input class="hidden" type="checkbox" id="navigation-menu-button" />
	<nav class="hidden sm:flex justify-center flex-col sm:flex-row gap-2 sm:gap-4 pb-2 sm:pb-0">
		<slot />
	</nav>
</div>

<style>
	input:checked + nav {
		display: flex;
	}
</style>
