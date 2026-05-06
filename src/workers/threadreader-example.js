
import { logger, shutdown, onMessage } from 'cluster-load-runner';

onMessage('stop', () => {
	shutdown();
});

// onMessage('start', async () => { });

onMessage('randomNumberMessage', async (message) => {
	logger.debug(`Received randomNumberMessage type message --> ${JSON.stringify(message)}`);

	logger.debug(`My random number is --> ${message.randomNumber}`);
});
