import React from 'react';

export default function PdfUploader({ onFile, serverFilePath, setServerFilePath }){
  return (
    <div>
      <label className="block text-sm font-medium">Upload PDF</label>
      <input type="file" accept="application/pdf" onChange={e => onFile(e.target.files[0])} className="mt-1" />

      <div className="mt-2 text-sm text-gray-600">Or use server-side test file (paste path):</div>
      <input value={serverFilePath} onChange={e=>setServerFilePath(e.target.value)} placeholder="/mnt/data/NIYAMR_Fullstack_Assignment.pdf" className="w-full p-2 border rounded mt-1" />
    </div>
  )
}
