from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent
from langchain_groq import ChatGroq

from dotenv import load_dotenv
load_dotenv()

import asyncio

async def main():
    client = MultiServerMCPClient(
        {
            "math":{
                "command": "python",
                "args":["mathserver.py"],
                "transport": "stdio",
            },
            "weather":{
                "url": "http://localhost:8000/mcp",
                "transport": "streamable-http",
            }
        }
    )


    import os
    os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

    tools = await client.get_tools()
    for tool in tools:
        print("=" * 50)
        print("NAME:", tool.name)
        print("DESCRIPTION:", tool.description)
        print("ARGS:", tool.args_schema)
    model = ChatGroq(
    model="llama-3.1-8b-instant"
)
    agent = create_agent(
        model, tools
    )


    math_response = await agent.ainvoke(
        {"messages": [{"role":"user", "content": "What is the result of addition of 3 and 5 and then multiplied by 12?"}]}
    )

    print(math_response['messages'][-1].content)


    weather_response = await agent.ainvoke(
        {"messages": [{"role":"user", "content": "What is the weather in London?"}]}
    )
    from pprint import pprint
    pprint(weather_response)
    
    print(weather_response['messages'][-1].content)


asyncio.run(main())