export const getBase64File = (file: File, asUrl = false) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const result = reader.result as string;
			if (asUrl) {
				resolve(result);
			} else {
				const resultAsUrl = result.split(',')[1];
				if (!resultAsUrl) {
					throw new Error(`Failed to read result as url: ${result}`);
				}
				resolve(resultAsUrl);
			}
		};
		reader.onerror = (error) => {
			reject(error);
		};
	});
