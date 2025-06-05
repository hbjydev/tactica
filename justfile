build:
  docker build \
    --tag ghcr.io/hbjydev/tactica:latest \
    .

format:
  cargo fmt --all

lint:
  cargo clippy --workspace --all-features
