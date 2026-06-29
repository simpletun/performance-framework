import { gaussianThinkTime, makeRequest, logger, FileReadMessenger, config, shutdown, onMessage } from 'cluster-load-runner';

const fileReadMessenger = new FileReadMessenger({ workerGroup: 'perfTestReader' });

onMessage('stop', () => {
	shutdown();
});

onMessage('start', async () => {
	logger.info(`Scenario starting at ${new Date()} and running for Duration ${config.scenario.duration / 1000 / 60} Minutes | Threads: ${config.threads.length} | SubThreads: ${config.subThreads} | Think Time: ${config.thinkFrom}-${config.thinkTo}ms`);
	for (let i = 0; i < config.subThreads; i++) {
		startSubThread();
	}
});

const startSubThread = async () => {
	logger.debug('-------------- Starting SubThread ----------------');

	while (true) {
		try {
			await doRequest();
		} catch (error) {
			logger.error(`Got an error --> ${error.stack}`);
		}

		await gaussianThinkTime(config.thinkFrom, config.thinkTo);
	}
};

const doRequest = async () => {
	const line = await fileReadMessenger.getLine(config.randomLine);
	const [method, path] = line.split(',').map(s => s.trim());
	const isPost = method.toUpperCase() === 'POST';

	await makeRequest({
		transactionName: isPost ? `Perf Test POST ${path}` : `Perf Test GET ${path}`,
		requestConfig: {
			method: method.toUpperCase(),
			path: `/${path}`,
			...(isPost && { payload: JSON.stringify({ value: Math.random().toString(36).slice(2) }) })
		}
	});
};
