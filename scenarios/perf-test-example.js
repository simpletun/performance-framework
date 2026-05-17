import { evenRampUp } from 'cluster-load-runner';

const second = 1000;
const minute = 60 * second;

const scenarioString = process.env.scenario || '{"duration":4,"hostname":"localhost","worker1":{"threads":5,"rampup":1,"subthreads":3}}'
const scenarioObj = JSON.parse(scenarioString)

const scenario = {
	duration: (scenarioObj.duration * minute) || 3 * minute
};

const server = {
	ssl: false,
	hostname: scenarioObj.hostname || 'localhost',
	port: scenarioObj.port || 3000,
	headers: {
		'Content-Type': 'application/json'
	}
};

const threadCounts = {
	worker1: {
		threads: scenarioObj.worker1.threads || 5,
		rampup: scenarioObj.worker1.rampup || 1,
		subthreads: scenarioObj.worker1.subthreads || 3,
		thinkfrom: scenarioObj.worker1.thinkfrom || 200,
		thinkto: scenarioObj.worker1.thinkto || 500
	}
}

const providers = [
	{
		workerType: 'file-data-provider',
		workerGroup: 'perfTestReader',
		threads: 1,
		fileName: 'endpoints.csv',
		chunkSize: Infinity,
		bufferSize: 512 * 1024
	}
];

const workers = [
	{
		workerType: 'perf-test-example',
		threads: evenRampUp(threadCounts.worker1.threads, threadCounts.worker1.rampup * minute),
		subThreads: threadCounts.worker1.subthreads,
		thinkFrom: threadCounts.worker1.thinkfrom,
		thinkTo: threadCounts.worker1.thinkto,
		server,
		scenario,
		randomLine: true
	}
];

export default { scenario, providers, workers };
