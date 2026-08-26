# 🛡️ PhishLens Frontend

### *AI-Powered Regional Language Phishing Detection Interface*

The **PhishLens Frontend** is the user-facing web application of the PhishLens cybersecurity project. Built using **React** and **Vite**, it provides a simple, responsive, and accessible interface that helps users detect phishing attempts through message analysis, URL analysis, and screenshot-based text analysis.

The frontend focuses on delivering a smooth user experience while handling user input, OCR-based text extraction, and presentation of phishing analysis results.

---

## 🌟 Frontend Overview

PhishLens is designed with a user-first approach, making phishing detection easy for both technical and non-technical users.

### ✨ What the Frontend Does

| Feature                     | Description                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| 💬 **Message Analyzer**     | Allows users to enter suspicious messages for phishing analysis.                                    |
| 🌐 **URL Analyzer**         | Accepts suspicious website links for analysis.                                                      |
| 📷 **Screenshot Analyzer**  | Uploads screenshots and extracts text using OCR.                                                    |
| 📊 **Results Dashboard**    | Displays phishing risk score, findings, explanations, and safety recommendations in a clear format. |
| 📱 **Responsive Interface** | Clean and mobile-friendly user interface built with React components.                               |

---

## 📁 Project Structure

```text
frontend/
├── public/                         # Static assets
├── src/
│   ├── assets/                     # Images and icons
│   ├── components/
│   │   ├── MessageAnalyzer.jsx     # Message analysis interface
│   │   ├── URLAnalyzer.jsx         # URL analysis interface
│   │   ├── ScreenshotAnalyzer.jsx  # Screenshot upload and OCR interface
│   │   ├── Navbar.jsx              # Navigation component
│   │   └── Footer.jsx              # Footer component
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   └── Results.jsx             # Results display page
│   ├── services/
│   │   └── api.js                  # Frontend API service
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

From the `frontend/` directory, run:

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

> **Note:** If port **5173** is already in use, Vite automatically starts on the next available port (such as **5174**).

---

## 🎯 Frontend Workflow

```text
User
 │
 ├── 💬 Enter Message
 ├── 🌐 Enter URL
 └── 📷 Upload Screenshot
             │
             ▼
      OCR Text Extraction
             │
             ▼
      Frontend Processing
             │
             ▼
      Results Dashboard
```

---

## 💡 Key Frontend Features

### 💬 Message Analyzer

* User-friendly interface for entering suspicious messages.
* Supports quick message submission from the homepage.

### 🌐 URL Analyzer

* Dedicated input field for suspicious URLs.
* Simple workflow for URL-based phishing analysis.

### 📷 Screenshot Analyzer

* Upload screenshots containing suspicious content.
* Extracts readable text using OCR before processing.

### 📊 Results Dashboard

* Displays phishing analysis in a structured layout.
* Highlights:

  * Risk Score
  * Risk Level
  * Key Findings
  * Explanation
  * Recommended Safe Action

---

## 🛠️ Technologies Used

| Technology       | Purpose                            |
| ---------------- | ---------------------------------- |
| **React**        | Frontend UI development            |
| **Vite**         | Development server and build tool  |
| **Axios**        | API request handling               |
| **React Router** | Page navigation                    |
| **Tesseract.js** | OCR for screenshot text extraction |
| **CSS**          | Responsive styling and layout      |

---

## 👩‍💻 Frontend Contribution

The frontend module includes:

* React-based user interface development.
* Responsive navigation and page layout.
* Message, URL, and Screenshot Analyzer components.
* OCR integration for screenshot text extraction.
* Results page for displaying phishing analysis in a user-friendly format.
* Axios service configuration for future backend integration.

---

## 📌 Frontend Status

| Module                       | Status      |
| ---------------------------- | ----------- |
| User Interface Development   | ✅ Completed |
| Message Analyzer             | ✅ Completed |
| URL Analyzer                 | ✅ Completed |
| Screenshot Analyzer with OCR | ✅ Completed |
| Results Dashboard            | ✅ Completed |
| Responsive Design            | ✅ Completed |
