# Coding Lantern 🧠

Coding Lantern is a specialized toolkit designed for comparative programmers and LeetCode enthusiasts. It helps users track their learning journey, identify mistake patterns, and understand code complexity through AI-driven analysis.

## 🚀 Problem Solved

Competitive programming often involves repetitive failure. Students grind hundreds of problems but often repeat the same specific types of mistakes (e.g., "Edge cases in DP", "TLE in Graph BFS").
Coding Lantern solves this by:

1.  **Journaling Mistakes**: Moving beyond "Solved/Unsolved" to tracking _why_ you failed.
2.  **Pattern Recognition**: Visualizing weak topics and recurring error types.
3.  **Complexity Analysis**: Demystifying Big-O notation for self-written code.

## 🏗 System Architecture

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js API Routes (Serverless functions).
- **Database**: MongoDB (via Mongoose) for storing User profiles and Mistake logs.
- **Authentication**: NextAuth.js (JWT Strategy) with Credentials Provider.
- **AI Engine**: OpenAI API (GPT-3.5-turbo) for code complexity analysis.

## 🤖 AI Usage

The application uses Generative AI in the **Complexity Analyzer** module.

- **Input**: User provides raw code snippets (C++, Java, Python, JS).
- **Process**: The backend sends this code to OpenAI with a structured system prompt requesting Big-O estimation and specific optimization tips.
- **Fallback**: If no API key is present, a deterministic mock analyzer runs basic regex-based static analysis to estimate complexity based on loop nesting.

## ⚠️ Limitations

- **Mock AI Mode**: Without a valid `OPENAI_API_KEY` in `.env.local`, the analysis is a simulation based on simple heuristic rules (counting nested loops).
- **Static Analysis**: The regex-based fallback is naive and cannot detect complex recursion or hidden complexity in library calls.
- **Language Support**: Primarily optimized for C++, Java, and JavaScript syntax.

## 📦 Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` file:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret
    OPENAI_API_KEY=your_openai_api_key (optional)
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```
