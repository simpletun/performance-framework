const second = 1000;

const scenario = {
	duration: 10 * second
};

exports.scenario = scenario;

exports.providers = [
	{
		workerType: 'file-data-provider',
		workerGroup: 'fileReader',
		threads: 1,
		scenario,
		recycleOnEof: false,
		// chunkSize: Infinity,
		// bufferSize: 512 * 1024,
		fileName: 'testInput.csv'
	}, {
		workerType: 'file-data-provider',
		workerGroup: 'otherFileReader',
		threads: 1,
		scenario,
		recycleOnEof: false,
		// chunkSize: Infinity,
		// bufferSize: 512 * 1024,
		fileName: 'testInput2.csv'
	}
];

exports.workers = [
	{
		workerType: 'file-example',
		threads: 1,
		subThreads: 1,
		scenario,
		randomLine: true,
		thinkFrom: 500,
		thinkTo: 3000
	}
];
