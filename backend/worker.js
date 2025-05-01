const FileModel = require('./model/File')
const { Worker  } = require('bullmq');
const IORedis = require('ioredis');
const ingestPdf = require('pdfWorker/ingest');
const { Queue } = require('bullmq');
const queue = new Queue('pdf-queue', { connection: { host: 'localhost', port: 6379 } });

const worker = new Worker(
  'pdf-queue',
  async job => {
    const {  fileUrl } = job.data;
    await ingestPdf(fileUrl);
  
  },
  { connection:{
    host:"localhost",
    port:6379
  }, concurrency: 1 }   
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
  
});
  
