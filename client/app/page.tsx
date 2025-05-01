"use client";
import {  Route, Routes, } from 'react-router-dom';
import HomeComponent from './Home'
import Index from './Pages/Index';
import Chat from './Pages/Chat';
import { PDFProvider } from './context/PDFContext';
import dynamic from 'next/dynamic';
const BrowserRouter = dynamic(() => import('react-router-dom').then((mod) => mod.BrowserRouter), { ssr: false });
export default function Home() {
  return (
   <div>
    <PDFProvider>
    <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index/>} />
            <Route path='/chat' element={<Chat />} />
          </Routes>
        </BrowserRouter>
      
        </PDFProvider>
   </div>
  );
}
