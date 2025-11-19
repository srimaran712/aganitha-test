// to call the api for health check for every 3 minute

import cron from 'node-cron';
import axios from 'axios';

cron.schedule('*/2 * * * *', () => {
    //calling the scheduler api
    console.log('calling the scheduler api')
    axios.get('https://smallurl-vcce.onrender.com/healthz')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
});
