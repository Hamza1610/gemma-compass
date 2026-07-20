# Ollama & Gemma Setup Guide (Backend Team)

This guide provides step-by-step instructions for the backend engineer to secure our biggest technical risk: running Google's Gemma model locally and proving it can code-switch to Hausa.

## Step 1: Install Ollama
Ollama is the engine that will run the Gemma model locally and serve it via a local API (running on port `11434` by default).

- **For Linux (Fedora/Ubuntu etc.):**
  Open your terminal and run:
  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```
- **For Windows/Mac:** 
  Download the installer directly from [ollama.com/download](https://ollama.com/download) and run it.

## Step 2: Download the Gemma Model
The project documentation refers to `gemma4:e2b`. However, the current officially supported lightweight Gemma model on Ollama is **Gemma 2 (2B parameters)**, which is incredibly fast on local machines. We also need the embedding model.

Run these commands in your terminal:
```bash
# Pull the language model
ollama pull gemma2:2b

# Pull the embedding model (used for the RAG/document vector search)
ollama pull nomic-embed-text
```
*(This may take a few minutes depending on your internet connection as it downloads the model weights).*

## Step 3: Test the Model in the Terminal (The Hausa Test)
Before writing any Python code, we must verify that Gemma can understand and explain concepts in Hausa.

Run the model in interactive terminal mode:
```bash
ollama run gemma2:2b
```

Once the `>>>` prompt appears, paste this exact prompt to test its code-switching and teaching abilities:
> You are an AI tutor helping a Nigerian university student. Explain the concept of an "Operating System" in simple English, and then provide a summary in Hausa.

Press **Enter**. If the model responds with a clear explanation in English followed by a natural Hausa summary, **our biggest technical risk is solved!**

To exit the interactive prompt, type `/bye`.

## Step 4: Verify the API is Running
FastAPI will communicate with Ollama over HTTP. By default, as long as the Ollama app/service is running in the background, the API is available.

You can verify this by opening another terminal and running:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "gemma2:2b",
  "prompt": "Say hello in Hausa",
  "stream": false
}'
```

## Next Steps for the Backend
Once this is verified, your backend friend can focus on updating the `app/core/` and `app/services/` files in the FastAPI project to point to `gemma2:2b` and start building the REST endpoints for the UI team!
