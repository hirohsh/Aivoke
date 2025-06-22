FROM ghcr.io/astral-sh/uv:python3.13-bookworm AS base


FROM base AS develop
ARG USERNAME=appuser
ENV UV_VENV_IN_PROJECT=1
RUN useradd -m $USERNAME
# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# AWS CLI のインストール
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws
# 作業ディレクトリの設定
WORKDIR "/fastapi_app"
EXPOSE 8000
# ユーザーの切り替え
USER $USERNAME
