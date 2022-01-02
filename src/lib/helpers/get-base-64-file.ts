export const getBase64File = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			resolve((reader.result as string).split(',')[1]);
		};
		reader.onerror = function (error) {
			reject(error);
		};
	});
