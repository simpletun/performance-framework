const second = 1000;

const preprodPass = process.env.dbPass;

const dbConnection = {
	connectionLimit: 10,
	host: 'av-aurora-master-qa.nikecloud.net',
	port: '3306',
	user: 'preprodrw',
	password: preprodPass,
	database: 'av_testdata'
};

const scenario = {
	duration: 10 * second
};

exports.scenario = scenario;

exports.providers = [
	{
		workerType: 'mysql-data-provider',
		workerGroup: 'queryProvider',
		threads: 1,
		dbConnection,
		scenario
	}
];

exports.workers = [
	{
		workerType: 'mysql-example',
		threads: 1,
		subThreads: 2,
		scenario
	}
];
