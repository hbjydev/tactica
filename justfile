build:
  docker build \
    --tag ghcr.io/hbjydev/tactica:latest \
    .

format:
  cargo fmt --all

format-check:
  cargo fmt --check --all

lint:
  cargo clippy --workspace --all-features
