const second = 1000;

const dbPass = process.env.dbPass;

const dbConnection = {
	connectionLimit: 10,
	host: 'db.example.com',
	port: '3306',
	user: 'db_user',
	password: dbPass,
	database: 'example_db'
};

const scenario = {
	duration: 10 * second
};

const providers = [
	{
		workerType: 'mysql-data-provider',
		workerGroup: 'queryProvider',
		threads: 1,
		dbConnection,
		scenario
	}
];

const workers = [
	{
		workerType: 'mysql-example',
		threads: 1,
		subThreads: 2,
		scenario
	}
];

export default { scenario, providers, workers };
