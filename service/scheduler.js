// to call the api for health check for every 3 minute

import nodeCron from 'node-cron';
import axios from 'axios';

nodeCron.schedule('*/3 * * * *', () => {
    axios.get('https://smallurl-vcce.onrender.com/healthz')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});
