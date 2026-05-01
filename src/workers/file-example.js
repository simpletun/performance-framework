/*
Example worker to get file data from file-data-provider worker.
This particular worker also shows a pattern for using subthreads to make more efficient use of each worker type.
The FileReadMessenger class makes use of inter-process communication to send a message requesting a line from the
file-data-provider worker.
*/
import { logger, config, shutdown, onMessage, FileReadMessenger, randomNumberFrom, sleep } from '@gtm-av/av-performance-library';

const fileReadMessenger = new FileReadMessenger({ workerGroup: 'fileReader' });
const otherFileReadMessenger = new FileReadMessenger({ workerGroup: 'otherFileReader' });

onMessage('stop', () => {
	shutdown();
});

onMessage('start', async () => {
	for(let i = 0; i < config.subThreads; i++){
		startSubThread();
	}
});

const startSubThread = async () => {
	logger.debug('-----------Starting Subthread-------------');
	while (true) {
		const promises = [fileReadMessenger.getLine(config.randomLine), otherFileReadMessenger.getLine(config.randomLine)];

		const [myLine, otherLine] = await Promise.all(promises);

		logger.debug(`My results are --> ${myLine}`);
		logger.debug(`My other results are --> ${otherLine}`);

		await sleep(randomNumberFrom(config.thinkFrom, config.thinkTo));
	}
};
