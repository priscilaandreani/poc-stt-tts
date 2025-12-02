# Conversational Commerce – STT & TTS (Spike)

A small proof-of-concept that explores Speech-to-Text (STT) and Text-to-Speech (TTS) across three approaches:

- Google Cloud (batch/async STT, streaming STT, and TTS)
- Web Speech API (browser-based STT/TTS demo)
- AWS Polly

This repo is meant for experimentation and local demos only.

## Features

- Google Cloud STT: async/batch transcription from audio files and streaming recognition.
- Google Cloud TTS: synthesize audio from text.
- Web Speech demo: simple browser page using the Web Speech API.
- Simple Node servers to host endpoints and static assets.

## Folder Structure

- `public/` – Static assets. Open `public/index.html` for demo.
- `services/google/` – Google Cloud scripts: `async-stt.js`, `async-tts.js`, `stream-sst.js`, `upload-gcs.js`.
- `services/aws/` – AWS server scaffold: `server.js`.
- `web-speech/` – Local server for the Web Speech demo: `server.js`.
- `input/` – Place source audio or text files for processing.
- `output/` – Generated results (e.g., transcripts or synthesized audio).

## Prerequisites

- Node.js 22 and npm.

### Google Flow:

- A Google Cloud project with the Speech and Text-to-Speech APIs enabled.
- A bucket named `poc-stt-and-tts` on GCP to storage files.
- A Service Account JSON key placed at the repo root as `google-credentials.json`.

### AWS Flow:

- A AWS Cloud project with Amazon Polly enabled

## Running the Web Speech Demo

The browser demo uses the Web Speech API (availability depends on the browser).

1. Start the demo server:

```zsh
node web-speech/server.js
```

2. Open the demo:

- Navigate to the URL printed by the server (`http://localhost:3000`).
- Use the page controls to test STT/TTS in the browser.

## Google Cloud – STT (Async/Batch)

Transcribe audio files using the async Speech-to-Text script.

```zsh
node services/google/async-stt.js
```

## Google Cloud – STT (Streaming)

Real-time transcription from an audio stream.

```zsh
node services/google/stream-sst.js
```

- Review `stream-sst.js` for microphone/device setup and any flags.

## Google Cloud – TTS

Synthesize audio from text.

```zsh
node services/google/async-tts.js
```

## Upload to Google Cloud Storage

If you want to process audio stored in GCS, first upload a file:

```zsh
node services/google/upload-gcs.js
```

## AWS Server

If you want to run the AWS Polly:

```zsh
node services/aws/server.js
```
