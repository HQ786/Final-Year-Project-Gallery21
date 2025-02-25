// pages/api/startCron/route.js
import startCronJob from '@lib/cronJobs';

export async function GET(req) {
    await startCronJob(); 
    return new Response(JSON.stringify({ message: 'Cron job started' }), { status: 200 });
}


// GET http://localhost:3000/api/startCronjob in postman to start job
