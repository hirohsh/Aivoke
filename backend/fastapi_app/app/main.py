import boto3
from dotenv import load_dotenv
from fastapi import FastAPI
from mypy_boto3_bedrock_runtime import BedrockRuntimeClient
from app.routers import router

load_dotenv()

app = FastAPI()

bedrock: BedrockRuntimeClient = boto3.client("bedrock-runtime") # type: ignore

app.include_router(router)
