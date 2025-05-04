require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Queue } = require('bullmq');


const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  process.exit(1);
}

// Initialize BullMQ queue using the Redis Cloud URL
const bullq = new Queue('pdf-queue', {
  connection: { url: redisUrl }
});

// Mongoose models
const ChatModel = require('./model/Chat');
const FileModel = require('./model/File');
const answerQuestion = require('./pdfWorker/answer');

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (err) {
    process.exit(1);
  }
}
connectDB();

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Upload endpoint
app.post('/upload/pdf', async (req, res) => {
  try {
    const { filePath, fileUrl, originalFileName, size } = req.body;
    const { id: userId } = req.query;

    await bullq.add('pdf-job', { fileUrl, userId });

    const exists = await FileModel.findOne({ fileName: originalFileName });
    if (exists) {
      return res.json({ status: 'success', message: 'File already exists.' });
    }

    await FileModel.create({
      fileId: userId,
      fileName:  originalFileName,
      filePath,
      FileSize: size
    });

    res.json({ status: 'success', message: 'File queued for processing.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Search endpoint
app.post('/search/pdf', async (req, res) => {
  try {
    const { question } = req.body;
    const { id: userId } = req.query;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const answer = await answerQuestion(question);
    await ChatModel.create({ userId, userChat: question, botChat: answer.answer });

    res.json({ answer: answer.answer, page: answer.docs.map((doc)=>({
      page: doc.page
    }))});
  } catch (err) {
   
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT);
