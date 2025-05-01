"use client";
import React from "react";
import { UploadIcon } from "lucide-react";
const FileUpload = () => {
  const handleClick = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const files = el.files.item(0);
        if (files) {
          const formData = new FormData();
          formData.append("pdf", files);
         await fetch('http://localhost:8000/upload/pdf', {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
          console.log('file uploaded')
        }
      }
    });
    el.click();
  };
  interface Data{
    answer: string;
    docs: {pageContent: string , page: number}[];
  }
  const [query, setQuery] = React.useState<string>("");
  const [data, setData] = React.useState<Data>({
    answer:"",
    docs:[]
  });
  const handleSearch = async () => {
    if (query.length > 0) {
      const res = await fetch('http://localhost:8000/search/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),  
      });
      const result = await res.json();
      setData({answer: result.answer, docs: result.docs});
    } else {
      alert('Please enter a word to search');
    }
  };
  
  return (
    <div className="justify-center items-center bg-slate-900 text-white shadow-2xl flex p-4 rounded-lg mt-[200px] flex-col gap-y-4">
      <div className="flex justify-center items-center flex-col gap-y-1.5">
        <h3>Upload pdf here...</h3>
        <UploadIcon
          size={24}
          className="cursor-pointer"
          onClick={handleClick}
        />
      </div>
      <div className="justify-center items-center flex flex-col gap-y-2 text-white">
        <h3>Search for a word in the pdf</h3>
        <input type="text" onChange={(e)=>setQuery(e.target.value)} value={query} className="h-9  bg-gray-500  p-2" />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
  {data && (
    <div className="text-white">
      {data && (
        <div className="flex flex-col gap-y-2"> 
          {
            data.answer && (
              <div className="text-white">
                <h3>Answer:</h3>
                <p>{data.answer}</p>
              </div>
            )}
            {data.docs && (
              <div className="text-white">
                <h3>Documents:</h3>
                {data.docs.map((doc, index) => (
                  <div key={index} className="mb-2">
                    <p className="mr-3 text-sm">
                      <strong>Page {doc?.page}:</strong>
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  )}
</div>
    </div>
  );
};

export default FileUpload;
