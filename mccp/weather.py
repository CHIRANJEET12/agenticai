from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Weather")

@mcp.tool()
async def get_weather(location: str)->str:
    """
    Get current weather information for a city.

    Args:
        location: Name of the city.
    """
    return "Its always raining in London."

if __name__ == "__main__":
    mcp.run(transport="streamable-http")