const secrets = {
	dbUri: `mongodb://tramor:arb0retum@ds219191.mlab.com:19191/virtual-vcr`
};

export const getSecret = key => secrets[key];