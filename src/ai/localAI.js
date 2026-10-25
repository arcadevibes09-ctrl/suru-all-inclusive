// FILE: src/ai/localAI.js
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

// Qwen2.5-0.5B-Instruct quantized is ~520MB and excels at structured JSON, notes & tasks
const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';
const BACKEND_URL = 'http://localhost:3001/api/ai';

class LocalAIEngine {
  constructor() {
    this.generator = null;
    this.isLoading = false;
    this.progress = 0;
    this.statusText = 'Idle (Model ~520 MB)';
  }

  async init(onProgress) {
    if (this.generator) return this.generator;
    if (this.isLoading) return null;

    this.isLoading = true;
    try {
      this.generator = await pipeline('text-generation', MODEL_ID, {
        dtype: 'q4',
        device: navigator.gpu ? 'webgpu' : 'wasm',
        progress_callback: (info) => {
          if (info.status === 'progress' && info.progress) {
            this.progress = Math.round(info.progress);
            this.statusText = `Downloading ${info.file}: ${this.progress}%`;
            if (onProgress) onProgress(this.progress, this.statusText);
          } else if (info.status === 'ready') {
            this.progress = 100;
            this.statusText = 'Ready (Qwen2.5-0.5B ~520MB)';
            if (onProgress) onProgress(100, this.statusText);
          }
        }
      });
      this.isLoading = false;
      return this.generator;
    } catch (err) {
      this.isLoading = false;
      this.statusText = 'Using Local Backend / Fallback';
      console.warn('WebGPU/WASM init fallback:', err);
      return null;
    }
  }

  async ask(prompt, systemContext = '', onProgress) {
    // 1. Try lightweight local Node/Ollama backend first if reachable
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemContext }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        return data.reply;
      }
    } catch {
      // Backend offline -> proceed with in-app 520MB ONNX model
    }

    // 2. Run in-browser / Capacitor on-device ~520MB model
    const gen = await this.init(onProgress);
    if (!gen) {
      return "Local AI model is still initializing or unsupported on this device. Start the backend server (`node backend/server.js`) or enable WebGPU.";
    }

    const messages = [
      {
        role: 'system',
        content:
          systemContext ||
          'You are Suru OS AI, a concise assistant managing study notes (using [[glossary]], {{highlight}}, [[[box]]] syntax), daily tasks, and gym PR metrics.'
      },
      { role: 'user', content: prompt }
    ];

    const output = await gen(messages, {
      max_new_tokens: 220,
      temperature: 0.4,
      do_sample: false
    });

    const generated = output[0]?.generated_text;
    if (Array.isArray(generated)) {
      return generated[generated.length - 1]?.content || 'Done.';
    }
    return String(generated);
  }
}

export const aiEngine = new LocalAIEngine();
