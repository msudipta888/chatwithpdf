const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const {Queue} = require('bullmq');

const bullq = new Queue('pdf-queue',{connection:{
  host:"localhost",
  port:6379
}});

const  ChatModel  = require("./model/Chat");
const FileModel = require("./model/File");
const answerQuestion = require("pdfWorker/answer");

require("dotenv").config();
async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds

  }).then(() => {
    console.log("MongoDB connected successfully");
  });
}
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

const app = express();
app.use(cors());
app.use(express());
app.use(express.json());





// Utility: Answer questions using stored embeddings + chat chain

app.post("/upload/pdf",  async (req, res) => {

 
  try {
  
    const {filePath,fileUrl,originalFileName,size} = req.body
   const {id} = req.query
   await bullq.add("pdf-job", {
    fileUrl,
  });
    const checkFile = await FileModel.findOne({fileName:originalFileName});
    if(checkFile){
      console.log('file already exists')
      return res.json({
        status: "success",
        message: "File already exists.",
      });
    }else{
      await FileModel.create({
        fileId:id,
        fileName: originalFileName,
        filePath: filePath,
        FileSize: size,
      })
    }
   
    res.json({
      status: "success",
      message: "File queued for processing.",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});
app.post("/search/pdf", async (req, res) => {
  try {
    const { question } = req.body;
    const {id} = req.query
   
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }
    const answer = await answerQuestion(question);
  
    await ChatModel.create({
      userId: id,
      userChat: question,
      botChat: answer.answer
    })
    res.json({ answer: answer.answer, page: answer.docs.map((doc)=>({
      page: doc.page
    }))});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
