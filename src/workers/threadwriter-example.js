
import { sleep, logger, randomNumberFrom, config, shutdown, onMessage, sendMessage } from '@gtm-av/av-performance-library';

onMessage('stop', () => {
	shutdown();
});

onMessage('start', async () => {
	for (let i = 0; i < config.subThreads; i++) {
		startSubThread();
	}
});

const startSubThread = async () => {
	logger.debug('-------------- Starting SubThread----------------');

	while (true) {

		try {
			await doRequest();
		}
		catch (error) {
			logger.error(`Got an error --> ${error.stack}`);
		}

		await sleep(randomNumberFrom(config.thinkFrom, config.thinkTo));
	}
};

const doRequest = async () => {

	const randomNumber = randomNumberFrom(1, 100);
	const messageType = 'randomNumberMessage';	// value will be used in onMessage handler
	const message = {
		type: messageType,				// type property must be used in onMessage handler in thread reader.
		randomNumber  		//nothing special about the rest of the message.  Handler will parse as necessary.
	};
	const workerGroup = 'randomNumberReaders';	// must be set accordingly on the reader worker in the scenario.

	logger.debug(`Sending message to workergroup ${workerGroup} --> ${JSON.stringify(message)}`);

	sendMessage('roundrobin', { workerGroup, message });
};
