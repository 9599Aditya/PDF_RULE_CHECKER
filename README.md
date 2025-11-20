🚀 NIYAMR PDF Rule Checker

A full-stack mini-tool to validate any PDF against custom user-defined rules.

⭐ About the Project

Yeh project ek simple PDF checking utility hai jo user se ek PDF leta hai, usse text extract karta hai, aur phir user ke diye huye rules ke hisaab se document ko validate karta hai.
Har rule ka result PASS ya FAIL ke saath reasoning, evidence aur confidence score deta hai.

Frontend React se bana hai, backend Express se, aur PDF parsing ke liye pdf-parse use kiya gaya hai.

🔥 Features

Upload any PDF

Optional server-side file path testing

Enter 3 custom rules

View:

PASS / FAIL

Evidence (from PDF text)

Reasoning

Confidence score

Clean UI using Tailwind CSS

Fast development using Vite

Simple backend API using Express

🛠 Tech Stack

Frontend: React, Vite, Tailwind CSS
Backend: Node.js, Express
PDF Extraction: pdf-parse
File Uploads: multer
Requests: axios

📂 Project Structure
project/
│
├── backend/
│   ├── server.js
│   ├── routes/check.js
│   ├── utils/pdfUtils.js
│   └── uploads/
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── components/
    │       ├── PdfUploader.jsx
    │       └── ResultsTable.jsx
    └── index.html

⚙️ Installation
1️⃣ Backend Setup
cd backend
npm install
node server.js


Expected output:

Backend listening on http://localhost:4000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Open the app here:
👉 http://localhost:5173

🧪 How to Test
✔ Option A — Upload PDF

Choose any PDF

Type 3 rules

Click Check Document

✔ Option B — Use test PDF (server path)
/mnt/data/NIYAMR_Fullstack_Assignment.pdf


⚠ DO NOT upload a file and enter a server path at the same time.

⚡ How It Works (Short Summary)

Frontend sends PDF + rules to backend

Backend extracts text using pdf-parse

Each rule is matched against the text

PASS/FAIL + evidence + reasoning return hote hain

Frontend table me results show karta hai

Simplified, clear and maintainable architecture.

🔮 Future Enhancements

More advanced rule-matching engine

Highlighted evidence text

Multiple PDF support

History & database integration

Deployed cloud version

👤 Author

Developed by Aditya Kashyap for learning and assignment purposes.
Clean architecture & simple UI par focus kiya gaya hai.