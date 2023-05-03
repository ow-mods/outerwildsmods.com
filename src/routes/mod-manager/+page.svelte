<script lang="ts">
	import CtaButton from '$lib/components/button/cta-button.svelte';
	import PageContainer from '$lib/components/page-container.svelte';
	import PageSectionImage from '$lib/components/page-section/page-section-image.svelte';
	import PageSection from '$lib/components/page-section/page-section.svelte';
	import WindowsIcon from '$lib/components/icons/windows-icon.svelte';
	import { websiteUrl } from '$lib/helpers/constants';
	import DebianIcon from '$lib/components/icons/debian-icon.svelte';
	import ArchIcon from '$lib/components/icons/arch-icon.svelte';
	import AppImageIcon from '$lib/components/icons/app-image-icon.svelte';
	import type { PageData } from './$types';
	// import NixIcon from '$lib/components/icons/nix-icon.svelte';

	export let data: PageData;
</script>

<PageContainer
	title="Outer Wilds Mod Manager - Download Windows app"
	description="Download, install, and manage Outer Wilds mods using the Outer Wilds Mod Manager for Windows."
	imageUrl="{websiteUrl}/images/mod-manager.webp"
	imageWidth={777}
	imageHeight={563}
>
	<PageSection title="Outer Wilds Mod Manager" id="mod-manager" isNarrow>
		<div>
			<PageSectionImage imageUrl="/images/mod-manager.webp" title="Outer Wilds Mod Manager" />
		</div>
		<div class="my-4">
			<CtaButton href={data.installerDownloadUrl} rel="noopener noreferrer">
				<WindowsIcon />
				Download the Outer Wilds Mod Manager for Windows
			</CtaButton>
		</div>
		<div>
			<details>
				<summary>For Linux</summary>
				<div class="my-2">
					<CtaButton href={data.debUrl} rel="noopener noreferrer">
						<DebianIcon />
						Download .deb package for Debian
					</CtaButton>
				</div>
				<div class="my-2">
					<CtaButton href={data.aurUrl} rel="noopener noreferrer">
						<ArchIcon />
						AUR Package for Arch Linux
					</CtaButton>
				</div>
				<!-- Waiting on Loco to make a Nix pkg for the GUI -->
				<!-- <div class="my-2">
					<CtaButton href={aurUrl} rel="noopener noreferrer">
						<NixIcon />
						NixOS Package
					</CtaButton>
				</div> -->
				<div class="my-2">
					<CtaButton href={data.appImageUrl} rel="noopener noreferrer">
						<AppImageIcon />
						Download AppImage For Linux
					</CtaButton>
				</div>
				<p class="mt-1">
					* Linux installs require that <a
						href="https://www.mono-project.com/"
						class="link"
						target="_blank"
						rel="noopener noreferrer">Mono</a
					> is installed and available on the PATH
				</p>
			</details>
		</div>
		<p class="mt-4">For all your modding needs! With access to features such as:</p>
		<ul class="my-4">
			<li>Downloading mods;</li>
			<li>Updating mods;</li>
			<li>Enabling / disabling mods;</li>
			<li>Looking at all the great mods you have in several different themes;</li>
			<li>Installing mods straight from the website;</li>
			<li>Installing mods from URLs and ZIP files;</li>
			<li>Running the game with mods enabled;</li>
			<li>
				Patching the game to run modded on Linux through <a
					href="https://www.mono-project.com/"
					class="link"
					rel="noopener noreferrer">Mono</a
				>.
			</li>
		</ul>
		<p>
			It also lets you install / update the{' '}
			<a class="link" href="/mods/owml">Outer Wilds Mod Loader</a> from within the app, so you don't
			need to deal with that yourself.
		</p>
	</PageSection>
	<PageSection title="How do I use this?" id="how-to-use" isNarrow>
		<ul>
			<li>Download the Outer Wilds Mod Manager installer;</li>
			<li>Run the downloaded .msi (you might need to ignore some Chrome / Windows warnings);</li>
			<li>Shortcuts are added to desktop and start menu, use them to run the manager;</li>
			<li>Run the manager</li>
			<li>Install OWML;</li>
			<li>Head to the "Get Mods" tab to install any mods you want;</li>
			<li>Press the top center play button to launch the game;</li>
			<li>You won't believe what happens next.</li>
		</ul>
	</PageSection>
	<PageSection title="How do I uninstall it?" id="uninstall" isNarrow>
		<p>
			First, remember that uninstalling the Mod Manager won't uninstall your mods. Make sure to
			remove all mods and run the game once before uninstalling.
		</p>
		<p>
			You can uninstall the Mod Manager by searching for "Add or remove programs" in the start menu
			(or in the control panel), and then finding Outer Wilds Mod Manager in the list.
		</p>
	</PageSection>
	<PageSection title="I Hate GUIs!" id="cli" isNarrow>
		<p>That's not very nice, but a CLI version of the manager is available.</p>
		<p>
			Just follow the steps to compile <a class="link" href={`${data.repoUrl}/tree/main/owmods_cli`}
				>on the GitHub repository</a
			>. Or find the latest CLI release and download from there (if the format you need is
			available).
		</p>
		<p>
			Once installed, run <code>owmods help</code> for a list of available commands
		</p>
	</PageSection>
	<PageSection title="Legacy Manager" id="legacy-manager" isNarrow>
		<p>
			The legacy Outer Wilds Mod Manager is <a
				href="https://github.com/ow-mods/ow-mod-manager/releases/latest/download/OuterWildsModManager-Installer.exe"
				class="link">available here</a
			> if you need to mod the alpha.
		</p>
		<p>
			The legacy manager also <a
				href="https://github.com/ow-mods/ow-mod-manager/releases/latest/download/OuterWildsModManager-Portable.zip"
				class="link">has a portable version</a
			>
		</p>
	</PageSection>
	<PageSection title="More information" id="more-info" isNarrow>
		<p>
			For more information, check the{' '}
			<a class="link" target="_blank" rel="noopener noreferrer" href={`${data.repoUrl}#readme`}>
				readme on GitHub
			</a>
		</p>
	</PageSection>
</PageContainer>
