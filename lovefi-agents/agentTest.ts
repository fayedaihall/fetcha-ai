import { sendMatchingRequest, Profile } from "./agentClient";

// Test profiles for different scenarios
const testProfiles: {
  [key: string]: { profile1: Profile; profile2: Profile; description: string };
} = {
  highCompatibility: {
    profile1: {
      age: 28,
      interests: ["hiking", "reading", "cooking", "travel", "music"],
      location: "New York",
      name: "Alice",
      bio: "Love exploring new places and trying new cuisines!",
    },
    profile2: {
      age: 30,
      interests: ["hiking", "music", "cooking", "photography", "travel"],
      location: "New York",
      name: "Bob",
      bio: "Outdoor enthusiast and music lover",
    },
    description: "High compatibility - similar interests, same city, close age",
  },

  moderateCompatibility: {
    profile1: {
      age: 25,
      interests: ["gaming", "anime", "technology"],
      location: "San Francisco",
      name: "Charlie",
      bio: "Tech enthusiast and gamer",
    },
    profile2: {
      age: 27,
      interests: ["technology", "reading", "coffee"],
      location: "San Francisco",
      name: "Diana",
      bio: "Book lover and coffee addict",
    },
    description: "Moderate compatibility - some common interests, same city",
  },

  lowCompatibility: {
    profile1: {
      age: 22,
      interests: ["partying", "sports", "social media"],
      location: "Miami",
      name: "Eve",
      bio: "Life of the party!",
    },
    profile2: {
      age: 35,
      interests: ["gardening", "yoga", "meditation"],
      location: "Seattle",
      name: "Frank",
      bio: "Zen master and nature lover",
    },
    description:
      "Low compatibility - different interests, different cities, age gap",
  },

  longDistance: {
    profile1: {
      age: 29,
      interests: ["cooking", "wine", "art"],
      location: "Paris",
      name: "Grace",
      bio: "French chef and art lover",
    },
    profile2: {
      age: 31,
      interests: ["cooking", "wine", "art", "travel"],
      location: "Tokyo",
      name: "Hiroshi",
      bio: "International chef and culture enthusiast",
    },
    description: "Long distance - similar interests but different continents",
  },
};

// Run all compatibility tests
async function runAllTests() {
  console.log("🧪 RUNNING COMPREHENSIVE AGENT COMPATIBILITY TESTS");
  console.log("=".repeat(80));

  const results: { [key: string]: any } = {};

  for (const [testName, testCase] of Object.entries(testProfiles)) {
    console.log(`\n🔍 Testing: ${testCase.description}`);
    console.log("-".repeat(60));

    try {
      const result = await sendMatchingRequest(
        testCase.profile1,
        testCase.profile2
      );
      results[testName] = {
        success: true,
        score: result.score,
        explanation: result.explanation,
        recommendations: result.recommendations,
      };

      console.log(`✅ Test passed - Score: ${result.score.toFixed(1)}/100`);
      console.log(`💬 ${result.explanation.substring(0, 100)}...`);
    } catch (error) {
      results[testName] = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      console.log(
        `❌ Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // Add delay between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary report
  console.log("\n📊 TEST SUMMARY REPORT");
  console.log("=".repeat(80));

  const successfulTests = Object.values(results).filter((r) => r.success);
  const failedTests = Object.values(results).filter((r) => !r.success);

  console.log(
    `✅ Successful tests: ${successfulTests.length}/${
      Object.keys(results).length
    }`
  );
  console.log(
    `❌ Failed tests: ${failedTests.length}/${Object.keys(results).length}`
  );

  if (successfulTests.length > 0) {
    const avgScore =
      successfulTests.reduce((sum, r) => sum + r.score, 0) /
      successfulTests.length;
    console.log(`📊 Average compatibility score: ${avgScore.toFixed(1)}/100`);

    const bestMatch = successfulTests.reduce((best, current) =>
      current.score > best.score ? current : best
    );
    console.log(`🏆 Best match: ${bestMatch.score.toFixed(1)}/100`);
  }

  if (failedTests.length > 0) {
    console.log("\n❌ Failed test details:");
    failedTests.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.error}`);
    });
  }

  return results;
}

// Run a single test case
async function runSingleTest(testName: string) {
  const testCase = testProfiles[testName];
  if (!testCase) {
    console.error(
      `❌ Test case '${testName}' not found. Available tests:`,
      Object.keys(testProfiles)
    );
    return;
  }

  console.log(`🧪 Running single test: ${testName}`);
  console.log(`📝 Description: ${testCase.description}`);
  console.log("=".repeat(60));

  try {
    const result = await sendMatchingRequest(
      testCase.profile1,
      testCase.profile2
    );
    console.log(`\n🎯 RESULT: ${result.score.toFixed(1)}/100`);
    console.log(`💬 ${result.explanation}`);
    console.log(`💡 Recommendations: ${result.recommendations.join(", ")}`);
    return result;
  } catch (error) {
    console.error(
      `❌ Test failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Run all tests by default
    await runAllTests();
  } else if (args[0] === "--single" && args[1]) {
    // Run a single test
    await runSingleTest(args[1]);
  } else if (args[0] === "--help") {
    console.log("🧪 Agent Compatibility Test Runner");
    console.log("");
    console.log("Usage:");
    console.log("  npm run test:agent                    # Run all tests");
    console.log("  npm run test:agent -- --single <name> # Run single test");
    console.log("  npm run test:agent -- --help          # Show this help");
    console.log("");
    console.log("Available test cases:");
    Object.entries(testProfiles).forEach(([name, test]) => {
      console.log(`  ${name}: ${test.description}`);
    });
  } else {
    console.error("❌ Invalid arguments. Use --help for usage information.");
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { runAllTests, runSingleTest, testProfiles };
