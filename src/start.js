import cluster from 'cluster';

if (cluster.isPrimary) {
	await import('cluster-load-runner/master');
}

else {
	await import('cluster-load-runner/worker');
}