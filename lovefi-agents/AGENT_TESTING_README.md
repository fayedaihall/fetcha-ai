# LoveFi Agent Testing Guide

This guide explains how to test your Fetch.ai dating matcher agent directly via the Agentverse API, bypassing the Vercel endpoint.

## 🚀 Quick Start

### 1. Set up Environment Variables

Copy the environment template and configure your API key:

```bash
cp env.example .env
```

Edit `.env` and add your Agentverse API key:

```bash
AGENTVERSE_API_KEY=your_actual_api_key_here
```

### 2. Run Basic Agent Test

```bash
npm run test:agent
```

### 3. Run Comprehensive Tests

```bash
npm run test:comprehensive
```

## 📁 Files Overview

- **`agentClient.ts`** - Core client for direct agent communication
- **`agentTest.ts`** - Comprehensive test suite with multiple scenarios
- **`env.example`** - Environment variables template
- **`.env`** - Your actual environment configuration (create this)

## 🔧 Configuration

### Required Environment Variables

| Variable             | Description             | Default                        |
| -------------------- | ----------------------- | ------------------------------ |
| `AGENTVERSE_API_KEY` | Your Agentverse API key | (required)                     |
| `AGENTVERSE_API_URL` | Agentverse API endpoint | `https://api.agentverse.ai/v1` |

### Agent Address

The client is configured to communicate with your agent at:

```
agent1qv4hquhtazgnwaxlhta8q787pcke38kv7ezkrwv67desjj2pvdz3zs0pkgc
```

## 🧪 Test Scenarios

The comprehensive test suite includes:

1. **High Compatibility** - Similar interests, same city, close age
2. **Moderate Compatibility** - Some common interests, same city
3. **Low Compatibility** - Different interests, different cities, age gap
4. **Long Distance** - Similar interests but different continents

## 📊 Usage Examples

### Basic Agent Communication

```typescript
import { sendMatchingRequest } from "./agentClient";

const profile1 = {
  age: 28,
  interests: ["hiking", "reading", "cooking"],
  location: "New York",
  name: "Alice",
  bio: "Love exploring new places!",
};

const profile2 = {
  age: 30,
  interests: ["hiking", "music", "cooking"],
  location: "Brooklyn",
  name: "Bob",
  bio: "Outdoor enthusiast",
};

const result = await sendMatchingRequest(profile1, profile2);
console.log(`Compatibility Score: ${result.score}/100`);
```

### Run Specific Test Cases

```bash
# Run single test case
npm run test:comprehensive -- --single highCompatibility

# Show available tests
npm run test:comprehensive -- --help
```

## 🔍 How It Works

1. **Direct API Communication**: Uses Agentverse's HTTP API instead of Vercel
2. **Message Format**: Sends properly formatted messages to your agent's address
3. **Response Handling**: Processes the agent's MatchingResponse and displays results
4. **Error Handling**: Comprehensive error handling for API failures

## 🚨 Troubleshooting

### Common Issues

1. **401 Unauthorized**

   - Check your `AGENTVERSE_API_KEY` in `.env`
   - Verify the API key is valid in Agentverse dashboard

2. **404 Not Found**

   - Verify the API endpoint URL
   - Check if your agent is registered and active

3. **Agent Not Responding**
   - Ensure your agent is running on Agentverse
   - Check agent status in the dashboard

### Debug Mode

Enable verbose logging by setting:

```bash
DEBUG=agentverse:* npm run test:agent
```

## 🔗 API Endpoints

The client communicates with:

- **Base URL**: `https://api.agentverse.ai/v1`
- **Messages Endpoint**: `/messages`
- **Method**: `POST`

## 📈 Expected Output

Successful test execution will show:

```
🚀 Testing direct agent communication via Agentverse...
📍 Agent Address: agent1qv4hquhtazgnwaxlhta8q787pcke38kv7ezkrwv67desjj2pvdz3zs0pkgc
🌐 API Endpoint: https://api.agentverse.ai/v1
🔑 API Key configured: Yes

🎯 MATCHING RESULTS:
==================================================
📊 Overall Score: 85.0/100
💬 Compatibility Analysis: Age compatibility...
💡 Recommendations: Plan activities around shared interests...
==================================================
```

## 🔄 Integration

### With Express Server

```typescript
import { sendMatchingRequest } from "./agentClient";

app.post("/api/match", async (req, res) => {
  try {
    const result = await sendMatchingRequest(
      req.body.profile1,
      req.body.profile2
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### With React Frontend

```typescript
import { sendMatchingRequest } from "./agentClient";

const handleMatch = async (profile1: Profile, profile2: Profile) => {
  try {
    const result = await sendMatchingRequest(profile1, profile2);
    setMatchResult(result);
  } catch (error) {
    setError(error.message);
  }
};
```

## 📚 Additional Resources

- [Agentverse Dashboard](https://agentverse.ai)
- [Fetch.ai Documentation](https://docs.fetch.ai)
- [uAgents Python SDK](https://github.com/fetchai/uAgents)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your agent is running on Agentverse
3. Test the API manually with curl
4. Check Agentverse logs for errors

---

**Note**: This implementation bypasses the Vercel endpoint and communicates directly with your agent via the Agentverse API, providing faster and more direct communication for testing purposes.
