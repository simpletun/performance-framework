const { evenRampUp } = require('cluster-load-runner');

const autoPass = process.env.autoPass;
const oktaClientSecret = process.env.oktaClientSecret;

const second = 1000;
const minute = 60 * second;
const env = 'qa';

const scenarioString = process.env.scenario || '{"duration":4,"hostname":"av-qa.nike-e2e.com","worker1":{"threads":5,"rampup":1,"subthreads":3}}'
const scenarioObj = JSON.parse(scenarioString)

const scenario = {
	duration: (scenarioObj.duration * minute ) || 3 * minute
};

const server = {
	ssl: true,
	hostname: scenarioObj.hostname || `av-${env}.nike-e2e.com`,
	headers: {
		'Content-Type': 'application/json'
	}
};

const okta = {
	clientSecret: oktaClientSecret,
	clientId: 'nike.gtms.assort-test',
	user: 'A.ASSTPLANQA',
	password: autoPass
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

exports.scenario = scenario;

exports.providers = [
	{
		workerType: 'file-data-provider',
		workerGroup: 'referenceReader',
		threads: 1,
		fileName: 'endpoints.csv',
		chunkSize: Infinity,
		bufferSize: 512 * 1024
	}
];

exports.workers = [
	{
		workerType: 'reference-example',
		threads: evenRampUp(threadCounts.worker1.threads, threadCounts.worker1.rampup * minute),
		subThreads: threadCounts.worker1.subthreads,
		thinkFrom: threadCounts.worker1.thinkfrom,
		thinkTo: threadCounts.worker1.thinkto,
		server,
		scenario,
		okta,
		randomLine: true
	}
];
