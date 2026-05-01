const rampup = require('@gtm-av/av-performance-library/build/utils/rampup');

const second = 1000;
const minute = 60 * second;
const scenario = {
	duration: 2 * minute
};

exports.scenario = scenario;

exports.providers = [];

exports.workers = [
	{
		workerType: 'threadwriter-example',
		threads: rampup.evenRampUp(2, 1 * minute),
		subThreads: 1,
		thinkFrom: 5000,
		thinkTo: 10000,
		scenario
	},
	{
		workerType: 'threadreader-example',
		workerGroup: 'randomNumberReaders',
		threads: 1,
		thinkFrom: 5000,
		thinkTo: 10000,
		scenario
	}
];

