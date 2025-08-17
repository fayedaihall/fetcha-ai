import axios from "axios";
import "dotenv/config";

// Configuration
const AGENT_ADDRESS =
  "agent1qv4hquhtazgnwaxlhta8q787pcke38qv7ezkrwv67desjj2pvdz3zs0pkgc";
const API_KEY = process.env.AGENTVERSE_API_KEY || "";

// Test endpoints from the documentation
const TEST_ENDPOINTS = [
  "https://api.agentverse.ai/v1/messages",
  "https://api.agentverse.ai/messages",
  "https://agentverse.ai/api/v1/messages",
  "https://agentverse.ai/api/messages",
  "https://api.agentverse.ai/v1/agents",
  "https://api.agentverse.ai/agents",
];

// Test payload as specified in the documentation
const testPayload = {
  recipient: AGENT_ADDRESS,
  message: {
    type: "MatchingRequest",
    data: {
      profile1: {
        age: 30,
        interests: ["hiking", "reading"],
        location: "New York",
      },
      profile2: {
        age: 28,
        interests: ["hiking", "music"],
        location: "Brooklyn",
      },
    },
  },
};

// Test a single endpoint
async function testEndpoint(endpoint: string, method: "GET" | "POST" = "GET") {
  try {
    console.log(`🔍 Testing ${method} ${endpoint}`);

    if (method === "GET") {
      // Test basic connectivity
      const response = await axios.get(endpoint, {
        timeout: 10000,
        validateStatus: () => true,
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Headers: ${JSON.stringify(response.headers, null, 2)}`);

      if (response.status === 200 || response.status === 401) {
        console.log(`   ✅ Endpoint accessible!`);
        return { endpoint, accessible: true, status: response.status, method };
      } else {
        console.log(
          `   ⚠️  Endpoint accessible but status: ${response.status}`
        );
        return { endpoint, accessible: true, status: response.status, method };
      }
    } else {
      // Test POST with the matching request
      if (!API_KEY) {
        console.log(`   ❌ No API key configured, skipping POST test`);
        return { endpoint, accessible: false, error: "No API key", method };
      }

      const response = await axios.post(endpoint, testPayload, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        validateStatus: () => true,
      });

      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);

      if (response.status === 200) {
        console.log(`   ✅ POST successful!`);
        return {
          endpoint,
          accessible: true,
          status: response.status,
          method,
          data: response.data,
        };
      } else if (response.status === 401) {
        console.log(`   ⚠️  Unauthorized - check API key`);
        return {
          endpoint,
          accessible: true,
          status: response.status,
          method,
          error: "Unauthorized",
        };
      } else {
        console.log(`   ⚠️  POST failed with status: ${response.status}`);
        return {
          endpoint,
          accessible: true,
          status: response.status,
          method,
          error: `HTTP ${response.status}`,
        };
      }
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
    } else {
      console.log(`   ❌ Unexpected error: ${error}`);
    }
    return {
      endpoint,
      accessible: false,
      error: error instanceof Error ? error.message : "Unknown error",
      method,
    };
  }
}

// Test all endpoints
async function testAllEndpoints() {
  console.log("🧪 MANUAL AGENTVERSE API TESTING");
  console.log("=".repeat(60));
  console.log(`📍 Target Agent: ${AGENT_ADDRESS}`);
  console.log(
    `🔑 API Key: ${API_KEY ? "Configured" : "Missing (check .env file)"}`
  );
  console.log("");

  const results = [];

  // First test GET requests to find accessible endpoints
  console.log("📡 TESTING ENDPOINT ACCESSIBILITY (GET requests)");
  console.log("-".repeat(50));

  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpoint(endpoint, "GET");
    results.push(result);
    console.log("");

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Then test POST requests on accessible endpoints
  console.log("📤 TESTING MESSAGE SENDING (POST requests)");
  console.log("-".repeat(50));

  const accessibleEndpoints = results.filter((r) => r.accessible);

  if (accessibleEndpoints.length === 0) {
    console.log("❌ No accessible endpoints found for POST testing");
  } else {
    for (const result of accessibleEndpoints) {
      if (result.method === "GET") {
        const postResult = await testEndpoint(result.endpoint, "POST");
        results.push(postResult);
        console.log("");

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  // Summary report
  console.log("📊 API TESTING SUMMARY");
  console.log("=".repeat(60));

  const getTests = results.filter((r) => r.method === "GET");
  const postTests = results.filter((r) => r.method === "POST");

  const accessible = getTests.filter((r) => r.accessible);
  const notFound = getTests.filter(
    (r) => !r.accessible && r.error?.includes("not found")
  );
  const otherErrors = getTests.filter(
    (r) => !r.accessible && !r.error?.includes("not found")
  );

  console.log(
    `✅ Accessible endpoints: ${accessible.length}/${getTests.length}`
  );
  console.log(`❌ Domain not found: ${notFound.length}`);
  console.log(`⚠️  Other errors: ${otherErrors.length}`);

  if (accessible.length > 0) {
    console.log("\n🎯 WORKING ENDPOINTS:");
    accessible.forEach((r) => {
      console.log(`   ${r.endpoint} (Status: ${r.status})`);
    });
  }

  // POST test results
  const successfulPosts = postTests.filter((r) => r.status === 200);
  const unauthorizedPosts = postTests.filter((r) => r.status === 401);
  const failedPosts = postTests.filter(
    (r) => r.status !== 200 && r.status !== 401
  );

  console.log(`\n📤 POST TEST RESULTS:`);
  console.log(`   ✅ Successful: ${successfulPosts.length}`);
  console.log(`   🔐 Unauthorized: ${unauthorizedPosts.length}`);
  console.log(`   ❌ Failed: ${failedPosts.length}`);

  if (successfulPosts.length > 0) {
    console.log(
      "\n🎉 SUCCESS! Found working endpoint for agent communication:"
    );
    successfulPosts.forEach((r) => {
      console.log(`   ${r.endpoint}`);
    });
  }

  if (unauthorizedPosts.length > 0) {
    console.log(
      "\n🔑 NEXT STEP: Update your .env file with the correct API key"
    );
    console.log("   Then run this test again to verify agent communication");
  }

  return results;
}

// Run the tests
if (require.main === module) {
  testAllEndpoints().catch(console.error);
}

export { testAllEndpoints, testEndpoint };
