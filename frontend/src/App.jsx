import React, { useState, useEffect } from 'react';
import PdfUploader from './components/PdfUploader';
import ResultsTable from './components/ResultsTable';
import axios from 'axios';

export default function App(){
  const [rules, setRules] = useState(['', '', '']);
  const [file, setFile] = useState(null);
  const [serverFilePath, setServerFilePath] = useState("/mnt/data/NIYAMR_Fullstack_Assignment.pdf");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(()=>{
    const t = setTimeout(()=> setShowPopup(true), 5000);
    return ()=> clearTimeout(t);
  },[])

  async function handleCheck(){
    setLoading(true);
    try{
      const form = new FormData();
      if (file) form.append('pdf', file);
      if (serverFilePath) form.append('serverFilePath', serverFilePath);
      form.append('rules', JSON.stringify(rules.filter(r=>r.trim())));

      const res = await axios.post('http://localhost:4000/api/check', form, { headers: { 'Content-Type':'multipart/form-data' }});
      setResults(res.data.results || []);
    }catch(err){
      console.error(err);
      alert('Error running check')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showPopup && (
        <div className="fixed top-6 right-6 bg-white shadow p-4 rounded">I have used AI assistance in certain parts of creating this project.</div>
      )}

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">NIYAMR PDF Rule Checker</h1>

        <PdfUploader onFile={(f) => setFile(f)} serverFilePath={serverFilePath} setServerFilePath={setServerFilePath} />

        <div className="mt-4">
          {[0,1,2].map(i=> (
            <input key={i} value={rules[i]} onChange={e=> { const next = [...rules]; next[i]=e.target.value; setRules(next)}} placeholder={`Rule ${i+1}`} className="w-full p-2 border rounded mb-2" />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={handleCheck} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Checking...':'Check Document'}</button>
        </div>

        <div className="mt-6">
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  )
}
