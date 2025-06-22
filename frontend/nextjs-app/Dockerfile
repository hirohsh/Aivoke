FROM node:22.16-bookworm AS base

FROM base AS develop
ARG UID=1000
ARG GID=1000
ARG USERNAME=app
ARG GROUPNAME=app
RUN groupadd --gid $GID $GROUPNAME && \
    useradd -u $UID -g $GID -m $USERNAME
USER $USERNAME
ENV NODE_ENV=development
EXPOSE 3000
WORKDIR /app/nextjs-app
