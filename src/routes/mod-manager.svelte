<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import LinkButton from '$lib/components/link-button.svelte';

	import PageLayout from '$lib/components/page-layout.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import SmartLink from '$lib/components/smart-link.svelte';

	const repoUrl = 'https://github.com/Raicuparta/ow-mod-manager';
	const downloadUrl = `${repoUrl}/releases/latest/download`;
	const installerDownloadUrl = `${downloadUrl}/OuterWildsModManager-Installer.exe`;
	const portableDownloadUrl = `${downloadUrl}/OuterWildsModManager-Portable.zip`;
</script>

<svelte:head>
	<title>Outer Wilds Mod Manager - Download Windows app</title>
	<meta
		name="description"
		content="Download, install, and manage Outer Wilds mods using the Outer Wilds Mod Manager for Windows."
	/>
</svelte:head>

<PageLayout>
	<PageSection title="Outer Wilds Mod Manager" id="mod-manager">
		<div>
			<PageSectionImage
				imageUrl="/images/mod-manager.png"
				title="Outer Wilds Mod Manager"
				height={300}
			/>
		</div>
		<div class="my-4">
			<LinkButton href={installerDownloadUrl} rel="noopener noreferrer" variant="main-download">
				<!-- <WindowsIcon /> -->
				Download the Outer Wilds Mod Manager for Windows
			</LinkButton>
		</div>
		<p>
			or{' '}
			<SmartLink href={portableDownloadUrl} rel="noopener noreferrer">
				download the portable version instead
			</SmartLink>
		</p>
		<p class="mt-4">For all your modding needs! With access to features such as:</p>
		<ul class="list-disc ml-8 my-4">
			<li>Downloading mods;</li>
			<li>Updating mods;</li>
			<li>Enabling / disabling mods;</li>
			<li>Looking at all the great mods you have;</li>
			<li>Running the game with mods enabled.</li>
		</ul>
		<p>
			It also lets you install / update the{' '}
			<SmartLink href="/mods/owml">Outer Wilds Mod Loader</SmartLink> from within the app, so you don't
			need to deal with that yourself.
		</p>
	</PageSection>
	<PageSection title="How do I use this?" id="how-to-use">
		<ul class="list-disc ml-8">
			<li>Download the Outer Wilds Mod Manager installer;</li>
			<li>Run the downloaded .exe (you might need to ignore some Chrome / Windows warnings);</li>
			<li>The Mod Manager should start automatically;</li>
			<li>
				Shortcuts are added to desktop and start menu, use them next time you want to run the
				manager;
			</li>
			<li>Install OWML;</li>
			<li>Install any mods you want;</li>
			<li>Press the big green button that says "Start Game";</li>
			<li>You won't believe what happens next.</li>
		</ul>
	</PageSection>
	<PageSection title="How do I uninstall it?" id="uninstall">
		<p>
			First, remember that uninstalling the Mod Manager won't uninstall your mods. Make sure to
			remove all mods and run the game once before uninstalling.
		</p>
		<p>
			You can uninstall the Mod Manager by searching for "Add or remove programs" in the start menu
			(or in the control panel), and then finding Outer Wilds Mod Manager in the list.
		</p>
	</PageSection>
	<PageSection title="More information" id="more-info">
		<p>
			For more information, check the{' '}
			<SmartLink isExternal href="https://github.com/Raicuparta/ow-mod-manager#readme">
				readme on GitHub
			</SmartLink>
		</p>
	</PageSection>
</PageLayout>
