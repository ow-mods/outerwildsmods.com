export async function load() {
	const repoUrl = 'https://github.com/Bwc9876/ow-mod-man';
	const aurBase = 'https://aur.archlinux.org/packages';
	const aurUrl = `${aurBase}/owmods-gui-bin`;
	const latestDownloadUrl = `${repoUrl}/releases/latest/download`;
	const latestJsonUrl = `${latestDownloadUrl}/latest.json`;

	const resp = await fetch(latestJsonUrl);
	const latest = await resp.json();
	const managerVersion = latest.version;

	// Don't always get latest as it could change and we'd grab the wrong assets
	const downloadUrl = `${repoUrl}/releases/download/gui_v${managerVersion}`;
	const productName = 'Outer.Wilds.Mod.Manager';

	const installerDownloadUrl = `${downloadUrl}/${productName}_${managerVersion}_x64_en-US.msi`;
	const nsisInstallerDownloadUrl = `${downloadUrl}/${productName}_${managerVersion}_x64-setup.exe`;
	const appImageUrl = `${downloadUrl}/${productName}_${managerVersion}_amd64.AppImage `;
	const debUrl = `${downloadUrl}/${productName}_${managerVersion}_amd64.deb`;
	const rpmUrl = `${downloadUrl}/${productName}-${managerVersion}-1.x86_64.rpm `;
	const dmgUrl = `${downloadUrl}/${productName}_${managerVersion}_x64.dmg`;

	return {
		repoUrl,
		downloadUrl,
		aurUrl,
		managerVersion,
		installerDownloadUrl,
		nsisInstallerDownloadUrl,
		appImageUrl,
		debUrl,
		rpmUrl,
		dmgUrl,
	};
}
