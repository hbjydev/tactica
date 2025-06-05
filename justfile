build-docker service:
  docker build \
    --file infra/docker/Dockerfile.{{ service }} \
    --tag ghcr.io/hbjydev/tactica/auth:latest \
    .
