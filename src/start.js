import { isMaster } from 'cluster';

if (isMaster) {
	require('cluster-load-runner/master');
}

else {
	require('cluster-load-runner/worker');
}