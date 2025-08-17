from uagents import Agent, Context, Model, Protocol
from uagents.setup import fund_agent_if_low
from pydantic import BaseModel
from typing import Dict, List

# Define models (unchanged from your corrected code)
class MatchingRequest(BaseModel):
    profile1: Dict = {}
    profile2: Dict = {}

class MatchingResponse(BaseModel):
    score: float
    explanation: str
    compatibility_factors: Dict
    recommendations: List[str]

# Create the agent
agent = Agent(
    name="dating_matcher",
    seed="your_secret_seed_phrase",  # Replace with a secure seed
    port=8001,  # Changed from 8000 to avoid conflict with Express server
    endpoint=["https://ethglobal-new-york.vercel.app/api/submit"],
)

# Protocol for the agent
protocol = Protocol(name="dating_matcher_protocol", version="1.0")

# Add startup event handler to log the address
@agent.on_event("startup")
async def log_agent_address(ctx: Context):
    ctx.logger.info(f"Dating Matcher Agent started with address: {agent.address}")
    ctx.logger.info(f"Agent Inspector available at: https://agentverse.ai/inspector/{agent.address}")

# Existing handler for matching requests (abbreviated for brevity)
@protocol.on_message(model=MatchingRequest, replies=MatchingResponse)
async def handle_matching_request(ctx: Context, sender: str, msg: MatchingRequest):
    ctx.logger.info(f"Received matching request from {sender}")
    # Your existing logic here...
    response = MatchingResponse(
        score=0.0,  # Placeholder; replace with your logic
        explanation="Test response",
        compatibility_factors={},
        recommendations=["Test recommendation"]
    )
    await ctx.send(sender, response)

# Include the protocol
agent.include(protocol)

if __name__ == "__main__":
    try:
        fund_agent_if_low(agent.wallet)
    except Exception as e:
        print(f"Warning: Could not fund agent: {e}")
        print("Continuing without funding...")
    
    agent.run()