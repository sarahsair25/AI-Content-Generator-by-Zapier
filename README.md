### AI-Powered Content Creation Engine 🚀
Data-Driven Automation with Zapier, Python, and GPT-4o

A sophisticated content generation pipeline that transforms raw data into platform-specific marketing assets. This project moves beyond simple "no-code" by implementing custom Python logic for dynamic prompt engineering and automated content validation.

🛠 Tech Stack
Workflow Orchestration: Zapier (Webhooks, Code by Zapier)

Intelligence: OpenAI API (GPT-4o) / Gemini 1.5 Pro

Custom Logic: Python 3.11 (Requests, JSON parsing)

Data Source: Google Sheets / Airtable (Database Mock)

Delivery: WordPress API / LinkedIn API / Slack

###  Key Features

Dynamic Prompt Injection: Uses Python to inject user-defined "Brand Tones" and "SEO Keywords" into the LLM context.

Content Sanitization: Automated regex-based cleaning of AI output to remove markdown artifacts before publishing.

Cost Management: Implements token calculation logic to prevent expensive API calls on oversized inputs.

Failure Handling: Custom error-catching within Zapier to notify stakeholders via Slack if an API call fails.



### 📐 Architecture

Ingestion: New row detected in Google Sheets (The "Content Brief").

Processing: Custom Code by Zapier step executes Python script for API interaction.

Transformation: Content is reformatted into JSON for various distribution endpoints.

Distribution: Concurrent posting to CMS and Social Media.

