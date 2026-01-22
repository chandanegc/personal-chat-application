# Production Optimized Chat Agent

This codebase is optimized for high-scale performance, capable of serving millions of users.

## 🚀 Key Optimization Strategies

1.  **Database Connection Pooling**:
    - Uses a Singleton pattern for MongoDB connections.
    - Configured `maxPoolSize: 100` to handle high concurrent requests efficiently without hitting connection limits.

2.  **Indexing**:
    - Created a compound index on `{ userId: 1, createdAt: -1 }`.
    - This ensures that fetching chat history for any user is nearly instantaneous, even with millions of records.

3.  **Context Windowing**:
    - Instead of fetching the entire history, the system now only retrieves the **last 10 messages**.
    - This prevents memory bloat in Node.js and reduces latency for the LLM (Gemini) by keeping the prompt size predictable.

4.  **Security & Reliability**:
    - **Helmet.js**: Sets various HTTP headers to protect against common web vulnerabilities.
    - **Rate Limiting**: Implemented `express-rate-limit` to prevent DDoS attacks and API abuse.
    - **CORS**: Configured for secure cross-origin resource sharing.

5.  **Health Monitoring**:
    - Added a `/health` endpoint for monitoring tools (like Datadog, New Relic) and container orchestrators (Kubernetes) to ensure server uptime.

6.  **Scalability Ready**:
    - Converted from a CLI tool to an Express API.
    - Stateless design allows horizontal scaling (running multiple instances behind a load balancer).

## 🛠️ How to Run in Production

1.  **Start the server**:

    ```bash
    npm start
    ```

2.  **API Usage**:
    - **Endpoint**: `POST /api/chat`
    - **Payload**:
      ```json
      {
        "userId": "user_123",
        "message": "Hello!"
      }
      ```
