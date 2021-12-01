require('dotenv').config();

const config = {
    poolId: process.env.REACT_APP_POOL_ID,
    host: process.env.REACT_APP_HOST,
    region: process.env.REACT_APP_REGION,
    baseUrl: process.env.REACT_APP_BASE_URL,
    topic: process.env.REACT_APP_TOPIC
};

export default config;