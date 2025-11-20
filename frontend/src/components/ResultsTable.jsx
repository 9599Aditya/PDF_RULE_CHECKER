import React from 'react';

export default function ResultsTable({ results=[] }){
  if (!results.length) return <div className="text-gray-500">No results yet.</div>
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="text-left border-b"><th className="p-2">Rule</th><th>Status</th><th>Evidence</th><th>Reasoning</th><th>Confidence</th></tr>
      </thead>
      <tbody>
        {results.map((r, i)=> (
          <tr key={i} className="border-b">
            <td className="p-2 align-top">{r.rule}</td>
            <td className={`p-2 font-semibold ${r.status==='pass' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</td>
            <td className="p-2">{r.evidence}</td>
            <td className="p-2">{r.reasoning}</td>
            <td className="p-2">{r.confidence}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
