<input
	accept="image/*"
	id="thumbnail-input"
	class="h-full w-full absolute left-0 top-0 opacity-0 text-xs p-2"
	type="file"
	disabled={!Boolean('TODO')}
	on:change={null}
/>
<span
	class="absolute bottom-0 right-0 bg-dark p-1 rounded-tl opacity-75 text-sm text-white pointer-events-none"
>
	✏️
</span>
