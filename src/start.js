import { isMaster } from 'cluster';

if (isMaster) {
	require('@gtm-av/av-performance-library/build/master');
}

else {
	require('@gtm-av/av-performance-library/build/worker');
}