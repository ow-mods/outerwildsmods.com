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
	// import NixIcon from '$lib/components/icons/nix-icon.svelte';

	const repoUrl = 'https://github.com/Bwc9876/ow-mod-man';
	const aurUrl = 'https://aur.archlinux.org/packages/owmods-gui-bin';
	const managerVersion = '0.3.1';
	const downloadUrl = `${repoUrl}/releases/download/gui_v${managerVersion}`;
	const installerDownloadUrl = `${downloadUrl}/Outer.Wilds.Mod.Manager_${managerVersion}_x64_en-US.msi`;
	const appImageUrl = `${downloadUrl}/outer-wilds-mod-manager_${managerVersion}_amd64.AppImage `;
	const debUrl = `${downloadUrl}/outer-wilds-mod-manager_${managerVersion}_amd64.deb`;

	const cliVersion = '0.3.1';
	const cliAurUrl = 'https://aur.archlinux.org/packages/owmods-cli-bin';
	const cliDownloadUrl = `${repoUrl}/release/download/cli_v${cliVersion}`;
	const cliDebUrl = `${cliDownloadUrl}/owmods-cli_${cliVersion}_amd64.deb`;
	const cliTarUrl = `${cliDownloadUrl}/owmods.tar.zst`;
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
			<details open>
				<summary>For Windows</summary>
				<div class="mt-2">
					<CtaButton href={installerDownloadUrl} rel="noopener noreferrer">
						<WindowsIcon />
						Download the Outer Wilds Mod Manager for Windows
					</CtaButton>
				</div>
			</details>
		</div>
		<div>
			<details>
				<summary>For Linux</summary>
				<div class="my-2">
					<CtaButton href={debUrl} rel="noopener noreferrer">
						<DebianIcon />
						Download .deb package for Debian
					</CtaButton>
				</div>
				<div class="my-2">
					<CtaButton href={aurUrl} rel="noopener noreferrer">
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
					<CtaButton href={appImageUrl} rel="noopener noreferrer">
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
		<p>That's not very nice, but a CLI version of the manager is available</p>
		<p>On Windows:</p>
		<ul>
			<li>
				You'll need to compile it with <a
					class="link"
					rel="noopener noreferrer"
					href="https://www.rust-lang.org/tools/install">Rust</a
				>
			</li>
			<li>
				After installing rust and cargo, run <code>cargo install owmods_cli</code>
			</li>
		</ul>
		<p>On Linux:</p>
		<ul>
			<li>
				You can install <a class="link" rel="noopener noreferrer" href={cliAurUrl}>from the AUR</a> if
				you're on an Arch based distro
			</li>
			<li>
				You can install it <a class="link" rel="noopener noreferrer" href={cliDebUrl}
					>from a .deb file</a
				> provided in the GitHub releases
			</li>
			<li>
				You can <a class="link" rel="noopener noreferrer" href={cliTarUrl}
					>get the binary in a .tar.zst file</a
				> provided in the GitHub releases
			</li>
			<li>Or you could follow the steps for Windows to install it via cargo</li>
		</ul>
		<p>
			Once installed, run <code>owmods help</code> for a list of available commands
		</p>
	</PageSection>
	<PageSection title="More information" id="more-info" isNarrow>
		<p>
			For more information, check the{' '}
			<a class="link" target="_blank" rel="noopener noreferrer" href={`${repoUrl}#readme`}>
				readme on GitHub
			</a>
		</p>
	</PageSection>
</PageContainer>
