import axios, { AxiosResponse } from "axios";
import "dotenv/config";

// Define interfaces for MatchingRequest and MatchingResponse
interface Profile {
  age: number;
  interests: string[];
  location: string;
  name?: string;
  bio?: string;
}

interface MatchingRequest {
  profile1: Profile;
  profile2: Profile;
}

interface CompatibilityFactors {
  age: {
    age_difference: number;
    compatibility_score: number;
    reason: string;
    life_stage_match: boolean;
  };
  interests: {
    direct_matches: number;
    semantic_matches: number;
    total_interests: number;
    common_categories: string[];
    compatibility_score: number;
  };
  location: {
    match_type: string;
    compatibility_score: number;
    reason: string;
  };
  overall_score: number;
}

interface MatchingResponse {
  score: number;
  explanation: string;
  compatibility_factors: CompatibilityFactors;
  recommendations: string[];
}

// Configuration
const AGENTVERSE_API_URL =
  process.env.AGENTVERSE_API_URL || "https://api.agentverse.ai/v1";
const AGENT_ADDRESS =
  "agent1qv4hquhtazgnwaxlhta8q787pcke38qv7ezkrwv67desjj2pvdz3zs0pkgc";
const API_KEY = process.env.AGENTVERSE_API_KEY || ""; // Replace with your Agentverse API key

// Fallback to Vercel endpoint if Agentverse API is not available
const VERCEL_FALLBACK_URL = "https://ethglobal-new-york.vercel.app/api/submit";

// Alternative endpoints to try if the default doesn't work
const ALTERNATIVE_ENDPOINTS = [
  "https://api.agentverse.ai/v1/messages",
  "https://api.agentverse.ai/messages",
  "https://agentverse.ai/api/v1/messages",
  "https://agentverse.ai/api/messages",
  "https://api.agentverse.ai/v1/agents",
  "https://api.agentverse.ai/agents",
];

// Function to test multiple endpoints and find a working one
async function findWorkingEndpoint(): Promise<string | null> {
  console.log("🔍 Testing multiple Agentverse API endpoints...");

  for (const endpoint of ALTERNATIVE_ENDPOINTS) {
    try {
      console.log(`   Testing: ${endpoint}`);
      const response = await axios.get(endpoint, {
        timeout: 5000,
        validateStatus: () => true, // Accept any status code
      });

      if (response.status === 200 || response.status === 401) {
        console.log(`   ✅ Found working endpoint: ${endpoint}`);
        return endpoint;
      } else {
        console.log(
          `   ⚠️  Endpoint accessible but status: ${response.status}`
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ENOTFOUND") {
          console.log(`   ❌ Domain not found`);
        } else if (error.code === "ECONNREFUSED") {
          console.log(`   ❌ Connection refused`);
        } else if (error.code === "ETIMEDOUT") {
          console.log(`   ❌ Timeout`);
        } else {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }
    }
  }

  console.log("❌ No working endpoints found");
  return null;
}

// Function to send a matching request via Vercel fallback
async function sendMatchingRequestViaVercel(
  profile1: Profile,
  profile2: Profile
): Promise<MatchingResponse> {
  try {
    console.log("🔄 Trying Vercel fallback endpoint...");

    const request: MatchingRequest = {
      profile1,
      profile2,
    };

    const response: AxiosResponse<MatchingResponse> = await axios.post(
      VERCEL_FALLBACK_URL,
      request,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("✅ Vercel endpoint successful!");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "❌ Vercel endpoint failed:",
        error.response?.data || error.message
      );
    } else {
      console.error("❌ Unexpected error with Vercel:", error);
    }
    throw new Error(
      `Vercel fallback failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Function to send a matching request to the agent via Agentverse
async function sendMatchingRequest(
  profile1: Profile,
  profile2: Profile
): Promise<MatchingResponse> {
  try {
    const request: MatchingRequest = {
      profile1,
      profile2,
    };

    const messagePayload = {
      recipient: AGENT_ADDRESS,
      message: {
        type: "MatchingRequest",
        data: request,
      },
    };

    console.log("Sending matching request to Agentverse:");
    console.log(JSON.stringify(messagePayload, null, 2));

    const response: AxiosResponse<MatchingResponse> = await axios.post(
      `${AGENTVERSE_API_URL}/messages`,
      messagePayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("Received response:");
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error communicating with Agentverse:",
        error.response?.data || error.message
      );
      throw new Error(
        `Failed to communicate with Agentverse: ${error.message}`
      );
    }
    console.error("Unexpected error:", error);
    throw new Error(
      "Unexpected error occurred while communicating with Agentverse"
    );
  }
}

// Example usage
async function main() {
  const profile1: Profile = {
    age: 30,
    interests: ["hiking", "reading", "cooking"],
    location: "New York",
    name: "Alice",
    bio: "Love exploring new places and trying new cuisines!",
  };

  const profile2: Profile = {
    age: 28,
    interests: ["hiking", "music", "cooking", "photography"],
    location: "Brooklyn",
    name: "Bob",
    bio: "Outdoor enthusiast and music lover",
  };

  try {
    console.log("🚀 Testing direct agent communication via Agentverse...");
    console.log("📍 Agent Address:", AGENT_ADDRESS);
    console.log("🌐 API Endpoint:", AGENTVERSE_API_URL);
    console.log(
      "🔑 API Key configured:",
      API_KEY ? "Yes" : "No (check .env file)"
    );
    console.log("");

    // Try to find a working endpoint first
    const workingEndpoint = await findWorkingEndpoint();
    if (workingEndpoint) {
      console.log(`🎯 Using working endpoint: ${workingEndpoint}`);
    } else {
      console.log("⚠️  No working endpoints found, trying default...");
    }

    let response: MatchingResponse;

    try {
      // Try Agentverse first
      response = await sendMatchingRequest(profile1, profile2);
      console.log("🎯 Agentverse communication successful!");
    } catch (error) {
      console.log("⚠️  Agentverse failed, trying Vercel fallback...");
      response = await sendMatchingRequestViaVercel(profile1, profile2);
      console.log("🎯 Vercel fallback successful!");
    }

    console.log("\n🎯 MATCHING RESULTS:");
    console.log("=".repeat(50));
    console.log(`📊 Overall Score: ${response.score.toFixed(1)}/100`);
    console.log(`💬 Explanation: ${response.explanation}`);
    console.log(`💡 Recommendations: ${response.recommendations.join(", ")}`);
    console.log("=".repeat(50));

    return response;
  } catch (error) {
    console.error("❌ Failed to get matching response:", error);
    throw error;
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  sendMatchingRequest,
  sendMatchingRequestViaVercel,
  MatchingRequest,
  MatchingResponse,
  Profile,
};
