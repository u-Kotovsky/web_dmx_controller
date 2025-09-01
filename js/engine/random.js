class RandomString {
	static UUIDGeneratorBrowser = () =>
		([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
		);
  	static randomHexColorCode = () => {
		let n = (Math.random() * 0xfffff * 1000000).toString(16);
    	return '#' + n.slice(0, 6);
	};
  	static randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

  	static randomRGB = (min = 0, max = 255) => {
    	return `rgb(${RandomString.randomNumberInRange(min, max)}, ${RandomString.randomNumberInRange(min, max)}, ${RandomString.randomNumberInRange(min, max)})`
  	}
  	static randomRGBA = (alpha = RandomString.randomNumberInRange(0, 255)) => {
    	return `rgb(${RandomString.randomNumberInRange(0, 255)}, ${RandomString.randomNumberInRange(0, 255)}, ${RandomString.randomNumberInRange(0, 255)}, ${alpha})`
  	}
  	static randomGrayscale = (min = 0, max = 255) => {
		let rnd = RandomString.randomNumberInRange(min, max);
    	return `rgb(${rnd}, ${rnd}, ${rnd})`
  	}
}