
import { sleep, makeRequest, getAuthToken, logger, randomNumberFrom, FileReadMessenger, config, shutdown, onMessage } from 'cluster-load-runner';

const fileReadMessenger = new FileReadMessenger({ workerGroup: 'referenceReader' });

onMessage('stop', () => {
	shutdown();
});

onMessage('start', async () => {
	logger.info(`Scenario starting at ${new Date()} and running for Duration ${config.scenario.duration / 1000 / 60} Minutes`)
	for (let i = 0; i < config.subThreads; i++) {
		startSubThread();
	}
});

const startSubThread = async () => {
	logger.debug('-------------- Starting SubThread----------------');

	const authToken = await getAuthToken();

	while (true) {

		try {
			await doRequest(authToken);
		}
		catch (error) {
			logger.error(`Got an error --> ${error.stack}`);
		}

		await sleep(randomNumberFrom(config.thinkFrom, config.thinkTo));
	}
};

const doRequest = async (authToken) => {

	const path = await fileReadMessenger.getLine(config.randomLine);

	await makeRequest({ transactionName: 'Reference GET', requestConfig: {
		path: `/av-reference-service/${path}`,
		headers: {'Authorization': authToken}
	}});
};
