# Gemma Compass: Kaggle GPU Edge Node Architecture

This guide outlines the updated, winning backend architecture for the Gemma Compass hackathon project. Because running large AI models locally on standard laptops leads to Out-of-Memory (OOM) crashes and slow inference, we have pivoted to a **"Local Mesh Edge Node"** topology.

## The Hackathon Narrative (How to Pitch This)
**The Problem:** Nigerian university students are overwhelmed with unstructured lecture notes but lack personalized study guidance. Traditional AI only answers direct questions. Furthermore, language barriers (English vs. Hausa) and poor internet connectivity prevent access to cloud-based tools.
**The Solution:** Gemma Compass introduces Adaptive Knowledge Navigation (AKN). We deployed a "Local Mesh Edge Node" where the heavy lifting (Gemma 4) runs on an offline institutional server box (simulated by our Kaggle backend cluster) installed on campus.
**The Execution:** Students connect their phones via the PWA directly to this local node over offline Wi-Fi. They can upload messy notes and receive personalized, code-switched (Hausa/English) study roadmaps—using 0% of their mobile data.

---

## Part 1: Backend Setup (For the Backend Engineer)

Instead of using Ollama on a local laptop, you will spin up a free Kaggle Notebook to simulate our "Institutional Server Rack". Kaggle provides free dual Tesla T4 GPUs (32GB VRAM total), which allows Gemma to respond in milliseconds.

### Step 1: Initialize the Kaggle Notebook
1. Create a free account on [Kaggle](https://www.kaggle.com/) and click **New Notebook**.
2. In the right-hand panel, go to **Session Options** -> **Accelerator** and select **GPU T4 x2**.
3. Turn on **Internet** in the session settings so you can download the model weights initially.

### Step 2: Install Dependencies
Create a cell in the notebook and run:
```python
!pip install -q fastapi uvicorn pyngrok nest-asyncio transformers accelerate bitsandbytes
```

### Step 3: Load the Gemma Model and Start the FastAPI Server
We will use `FastAPI` to create endpoints, and `ngrok` to expose them securely over a tunnel to our local frontend. 

Create a new cell and run this exact code:

```python
import os
import torch
import nest_asyncio
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pyngrok import ngrok
import uvicorn
from transformers import AutoTokenizer, AutoModelForCausalLM

# 1. Load the Official Gemma Model into the T4 GPUs
# Note: Adjust model_id if you are using specific Gemma variants
model_id = "google/gemma-2-2b-it" 

print("Initializing Gemma Model Engine...")
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.bfloat16
)
print("SUCCESS: Gemma is loaded onto the server node memory!")

# 2. Setup FastAPI Server
app = FastAPI(title="Gemma Compass Edge Node")

# Allow CORS for our Next.js local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # Gemma Compass AKN Context Prompt
    system_instruction = (
        "You are Gemma Compass, an Adaptive Knowledge Navigation (AKN) study tutor for university students. "
        "Your job is to transform raw study notes into structured explanations, identify knowledge gaps, "
        "and generate personalized learning roadmaps. "
        "If the student struggles with a concept, or if they speak Hausa, code-switch naturally "
        "between English and Hausa to provide clear, native-language explanations."
    )
    
    full_prompt = f"<bos><start_of_turn>user\n{system_instruction}\n\n{request.prompt}<end_of_turn>\n<start_of_turn>model\n"
    
    inputs = tokenizer(full_prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=512)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Clean up the response to remove the prompt text
    clean_response = response_text.split("model\n")[-1].strip()
    return {"response": clean_response}

# 3. Expose the Server via Ngrok
# Get an auth token from ngrok.com and replace 'YOUR_NGROK_AUTH_TOKEN'
ngrok.set_auth_token("YOUR_NGROK_AUTH_TOKEN")
public_url = ngrok.connect(8000)
print(f"\n=======================================================")
print(f"✅ YOUR SECURE BACKEND URL IS: {public_url.public_url}")
print(f"Give this URL to the Frontend Team!")
print(f"=======================================================\n")

# 4. Run the Server
nest_asyncio.apply()
uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Backend Deliverable:** Once you run this cell, send the generated `Ngrok Public URL` to the frontend developer.

---

## Part 2: Frontend Setup (For the Frontend Engineer)

We are using Next.js (TypeScript) for our mobile-first PWA dashboard.

### Step 1: Environment Variables
On your local laptop, create a `.env.local` file in the `frontend` directory and paste the Ngrok URL provided by the backend developer:

```env
NEXT_PUBLIC_API_URL=https://<your-unique-ngrok-id>.ngrok-free.app
```

### Step 2: API Integration inside Next.js
Whenever the frontend needs to communicate with Gemma (e.g., when a user submits a study question), we hit the Ngrok tunnel which routes to the Kaggle GPUs.

```typescript
// Example frontend fetch call to Gemma Edge Node
const askGemma = async (userPrompt: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });
    
    const data = await res.json();
    console.log("Gemma says:", data.response);
    return data.response;
  } catch (error) {
    console.error("Failed to connect to local edge node:", error);
  }
};
```

### Next Frontend Milestones:
1. Build the **Document Upload Dropzone** for PDF/Image ingestion.
2. Build the **Chat UI** using the `askGemma` function above to interact with the backend in real-time.
