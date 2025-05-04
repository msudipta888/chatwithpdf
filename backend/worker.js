const FileModel = require('./model/File')
const { Worker  } = require('bullmq');
const ingestPdf = require('./pdfWorker/ingest');
require('dotenv').config()
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  process.exit(1);
}
const worker = new Worker(
  'pdf-queue',
  async job => {
    const {  fileUrl } = job.data;
    await ingestPdf(fileUrl);
  
  },
  { connection:{
   url:redisUrl
  }, concurrency: 1 }   
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);


});
  
