export const getBase64File = (file: File, asUrl = false) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			const result = reader.result as string;
			resolve(asUrl ? result : result.split(',')[1]);
		};
		reader.onerror = function (error) {
			reject(error);
		};
	});
