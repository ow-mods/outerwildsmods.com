export async function load() {
	const repoUrl = 'https://github.com/Bwc9876/ow-mod-man';
	const aurBase = 'https://aur.archlinux.org/packages';
	const aurUrl = `${aurBase}/owmods-gui-bin`;
	const downloadUrl = `${repoUrl}/releases/latest/download`;
	const latestJsonUrl = `${downloadUrl}/latest.json`;

	const resp = await fetch(latestJsonUrl);
	const latest = await resp.json();
	const managerVersion = latest.version;

	const installerDownloadUrl = `${downloadUrl}/Outer.Wilds.Mod.Manager_${managerVersion}_x64_en-US.msi`;
	const appImageUrl = `${downloadUrl}/outer-wilds-mod-manager_${managerVersion}_amd64.AppImage `;
	const debUrl = `${downloadUrl}/outer-wilds-mod-manager_${managerVersion}_amd64.deb`;
	const rpmUrl = `${downloadUrl}/outer-wilds-mod-manager-${managerVersion}-1.x86_64.rpm `;

	return {
		repoUrl,
		downloadUrl,
		aurUrl,
		managerVersion,
		installerDownloadUrl,
		appImageUrl,
		debUrl,
		rpmUrl,
	};
}
