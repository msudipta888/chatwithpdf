const {
  WebPDFLoader,
} = require("@langchain/community/document_loaders/web/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { fetch } = require("undici");
const { QdrantClient } = require("@qdrant/js-client-rest");
require('dotenv').config()
const { QdrantVectorStore } = require("@langchain/qdrant");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: process.env.GEINI_EMBEDDING_MODEL,
  apiKey: `${process.env.GEMINI_API_EMBEDDING}`,
});
const qdrantConfig = {
  collectionName: process.env.COLLECTION_NAME,
};
const client = new QdrantClient({
  url: process.env.QURDANT_URL,
  apiKey: process.env.QURDANT_API,
});

const ingestPdf = async (fileUrl) => {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

    const blob = await res.blob();
    const loader = new WebPDFLoader(blob, { splitPages: true });
    const docs = await loader.load();

    //2.split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100000,
      chunkOverlap: 0,
    });
    const chunks = await splitter.splitDocuments(docs);

    const chunkDocs = chunks.map((chunk, ind) => ({
      pageContent: chunk.pageContent,
      metadata: {
        page: chunk.metadata?.page || ind + 1,
      },
    }));

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        client: client,
        collectionName: qdrantConfig.collectionName,
        prefer_grpc: false,
      }
    );

    await vectorStore.addDocuments(chunkDocs);
  } catch (err) {
    console.error("Error ingesting PDF:", err);
  }
};
module.exports = ingestPdf;
