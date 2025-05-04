const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
require('dotenv').config()
const { GoogleGenAI } = require("@google/genai");
const { QdrantVectorStore } = require("@langchain/qdrant");
const { QdrantClient } = require('@qdrant/js-client-rest');

const embeddings = new GoogleGenerativeAIEmbeddings({
  model:process.env.GEINI_EMBEDDING_MODEL ,
  apiKey:`${process.env.GEMINI_API_EMBEDDING}`,
});
const qdrantConfig = {
  collectionName: process.env.COLLECTION_NAME,
};
const Qclient = new QdrantClient({
 url:process.env.QURDANT_URL,
 apiKey:process.env.QURDANT_API
});
const answerQuestion = async (question) => {
  try {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            client: Qclient,
            collectionName: qdrantConfig.collectionName,
            prefer_grpc: false      
          }
        );
    const ret = vectorStore.asRetriever({
      k: 2,
    });
    const result = await ret.invoke(question);
   
    const prompt = `You are a helpful AI assistant who answers the question as detailed as possible from the provided context. 
    If the answer is not in the provided context, just say "Answer is not available in the context." 
    Do not provide wrong answers.
    
    Context:
    ${JSON.stringify(result)}
    
    Question:
    ${question}
    `;

    const client = new GoogleGenAI({
      apiKey:`${process.env.GEMINI_API_KEY}`,
    });

    const chat = await client.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return {
      answer:
        chat.candidates?.[0].content.parts?.[0].text || "No answer generated.",
      docs: result.map((doc) => ({
        page: doc.metadata?.page,
      })),
    };
  } catch (err) {
    throw err;
  }
};
module.exports=answerQuestion