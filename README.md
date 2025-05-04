# ChatWithPDF

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-333333?logo=nextdotjs)](https://nextjs.org/)  
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs)](https://nodejs.org/)  
[![Dockerized](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)](https://www.docker.com/)  

**ChatWithPDF** transforms static PDF documents into intelligent chatbots. Upload your PDFs, then ask questions, request summaries, or dive deep—backed by Google Gemini embeddings and AI.

---

## 📝 Table of Contents

- [🎯 Features](#-features)  
- [🛠️ Tech Stack](#-️-tech-stack)  
- [🚀 Architecture & Key Components](#-architecture--key-components)  
- [⚙️ Installation](#-installation)  
- [📦 Usage](#-usage)  
- [🧩 Configuration](#-configuration)  
- [🚢 Docker Deployment](#-docker-deployment)  
- [📖 How It Works](#-how-it-works)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  

---

## 🎯 Features

- **Upload & Index** any PDF—extracts text, images, and metadata  
- **Embeddings** via Google Gemini embedding model  
- **Conversational QA** powered by Google Gemini AI API  
- **Streaming Responses** for low-latency, real-time chat  
- **Session Memory** to maintain context across questions  
- **Queue Management** with BullMQ (FIFO)  
- **Multi-document Support**  

---

## 🛠️ Tech Stack

### Frontend

- **Next.js** — SSR & React framework  
- **Tailwind CSS** — Utility-first styling  
- **TypeScript** — Type safety  
- **SWR** — Data fetching hooks  

### Backend

- **Node.js & Express** — RESTful API  
- **langchain.js** — Document loaders, embeddings, vector stores, chains  
- **Google Gemini Embedding Model** — High-quality vector embeddings  
- **Google Gemini AI API** — Natural language query & response  
- **Qdrant** — Vector database for fast similarity search  
- **MongoDB** — Stores PDF metadata & user sessions  
- **BullMQ** — Manages PDF processing queue (FIFO)  

### DevOps

- **Docker & Docker Compose** — Containerized frontend & backend  
- **GitHub Actions** — CI/CD (lint, test, build, deploy)  

---

## 🚀 Architecture & Key Components

![diagram-export-5-4-2025-7_22_45-PM](https://github.com/user-attachments/assets/a6186650-c817-4cd0-85dd-245b511d957b)

1. **Next.js Frontend**  
   - Upload PDFs, send user queries, stream responses.  
2. **Express API**  
   - Receives uploads, orchestrates LangChain pipelines.  
3. **LangChain.js**  
   - `PDFLoader` → text chunking → Gemini embeddings → Qdrant storage  
   - QA chain: vector search → context + question → Gemini AI API → streamed answer  
4. **BullMQ Queue**  
   - Ensures ordered, reliable PDF processing.  
5. **MongoDB**  
   - Persists user sessions, PDF metadata, and chat histories.  
6. **Qdrant**  
   - Stores and retrieves vector embeddings at scale.  

---

## ⚙️ Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/msudipta888/chatwithpdf.git
   cd chatwithpdf
   
  Create a .env in /backend
  
        PORT=3000
      GEMINI_API_KEY=your_gemini_api_key
      GEMINI_EMBEDDING_MODEL=models/text-embedding-004
      REDIS_URL=redis://<username>:<password>@<host>:<port>
      QDRANT_URL=http://<host>:<port>
      QDRANT_API_KEY=your_qdrant_api_key
      MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/chatwithpdf?retryWrites=true&w=majority
      MONGODB_COLLECTION=pdf_documents

 .env.local in /client

     NEXT_PUBLIC_API_URL=http://localhost:3000
    BYTES_API_KEY=your_bytes_api_key

 # Backend
 
     cd backend
    npm install

# Frontend
     cd ../client
     npm install

Start Backend :

      cd backend
      npm run dev
Start Frontend:

     cd ../client
     npm run dev
     
Build and launch all services:

      docker-compose up --build

🤝 Contributing
Fork the repository

Create a branch:

     git checkout -b feature/YourFeature
Commit your changes:

    git commit -m "Add Some Feature"
Push and open a Pull Request.        
