# 🤖 Buddy AI Friend

### Your Personal AI Companion & Smart Assistant

Buddy AI Friend is an AI-powered personal companion designed to make everyday conversations, learning, and productivity easier. Built using the MERN stack and Groq AI, Buddy provides intelligent responses, document analysis, and a friendly conversational experience through a modern, responsive interface.

---
## 🌐 Live Demo

**Try Buddy AI Friend here:**

👉 https://buddy-ai-friend-frontend.vercel.app

## 🚀 Backend API

https://buddy-ai-friend-1.onrender.com
## ✨ Features

- 💬 **AI-Powered Chat:** Interact with Buddy and receive intelligent, natural-language responses.
- 📄 **Document Analysis:** Upload PDF, DOCX, TXT, and CSV files and ask questions about their content.
- 🖼️ **Image Upload:** Attach supported images to your conversations.
- 🧠 **Conversation History:** Access previous conversations.
- 🔐 **User Authentication:** Secure registration and login.
- 🌙 **Dark & Light Mode:** Switch between themes.
- 📱 **Responsive Design:** Enjoy the application on desktop and mobile devices.
- ⚡ **Real-Time AI Responses:** Get responses powered by Groq AI.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Vite | Frontend build tool |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB Atlas | Database |
| Groq AI | AI-powered responses |
| JWT | Authentication |
| CSS | Styling and responsive UI |
| Multer | File uploads |

## 📂 Project Structure

```text
Buddy-AI-Friend/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run Buddy AI Friend locally.

### 1. Clone the Repository

```bash
git clone https://github.com/MotupalliSasanth143/Buddy-AI-Friend.git
```

```bash
cd Buddy-AI-Friend
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔑 Environment Variables

Configure your own credentials before running the application.

| Variable | Description |
|---|---|
| PORT | Backend server port |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret used for authentication |
| GROQ_API_KEY | API key for Groq AI |

**Important:** Never upload your `.env` file or expose API keys and other sensitive credentials on GitHub.

## 🎯 Project Objective

The main objective of Buddy AI Friend is to create an accessible AI companion that combines intelligent conversations, document understanding, and a user-friendly experience in one platform.

## 🔮 Future Enhancements

- Voice-based conversations.
- Improved personalized AI assistance.
- More document formats and advanced analysis.
- Additional productivity tools.
- Public cloud deployment.

## 👨‍💻 Author

**Sasanth Motupalli**

GitHub: [@MotupalliSasanth143](https://github.com/MotupalliSasanth143)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Made with ❤️ using the MERN Stack and Groq AI.**
