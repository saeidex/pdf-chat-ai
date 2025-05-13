# PdfChat - AI-Powered Document Analysis

PdfChat is an application that enables users to chat with their PDF documents using advanced AI. It extracts insights, answers questions, and analyzes the content of PDF documents instantly, eliminating the need for manual searching.

## Features

- **PDF Document Upload**: Upload and manage your PDF documents securely
- **AI-Powered Chat**: Ask questions about your documents and receive intelligent, contextually relevant responses
- **Document Management**: Browse, organize, and access your uploaded documents easily
- **Interactive PDF Viewer**: View PDFs alongside the chat interface with a resizable panel design
- **Markdown Support**: Beautifully formatted responses with syntax highlighting and markdown rendering
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable reading
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Hono.js for API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Storage**: Azure Blob Storage for PDF documents
- **AI**: Azure OpenAI for document analysis and chat responses
- **PDF Processing**: pdf-parse and react-pdf for document processing and rendering

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ or Bun runtime installed
- PostgreSQL database
- Azure account with the following services:
    - Azure Blob Storage
    - Azure OpenAI service (with appropriate model deployments)
- Clerk account for authentication

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/saeidex/pdf-chat-ai --depth=1
cd pdf-chat-ai
```

2. **Install dependencies**

```bash
bun i
```

3. **Environment Configuration**

Create a `.env` file in the root directory with the following variables:

```env
# App
NODE_ENV=development
LOG_LEVEL=info

# Clerk Auth
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_postgresql_database_url

# Azure Storage
AZURE_STORAGE_ACCOUNT_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_ACCOUNT_ACCESS_KEY=your_access_key
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_BLOB_CONTAINER_NAME=pdf-chat
AZURE_BLOB_URL=https://your_storage_account.blob.core.windows.net

# Azure OpenAI
AZURE_OPENAI_API_ENDPOINT=your_api_endpoint
AZURE_OPENAI_API_KEY=your_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1
AZURE_OPENAI_API_VERSION=2024-04-01-preview
AZURE_OPENAI_MODEL_NAME=gpt-4.1
```

4. **Database Setup**

```bash
# Generate Prisma client
bunx prisma generate

# Apply migrations
bunx prisma migrate dev
```

5. **Run the development server**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in using Clerk authentication
2. Navigate to the dashboard
3. Upload PDF documents using the upload card
4. Click on a document to start chatting
5. Ask questions about your document to receive AI-generated responses

## License

[MIT](LICENSE)
