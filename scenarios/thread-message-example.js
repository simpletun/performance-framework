import { evenRampUp } from 'cluster-load-runner';

const second = 1000;
const minute = 60 * second;
const scenario = {
	duration: 2 * minute
};

const providers = [];

const workers = [
	{
		workerType: 'threadwriter-example',
		threads: evenRampUp(2, 1 * minute),
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

export default { scenario, providers, workers };
