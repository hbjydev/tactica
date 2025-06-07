FROM rust:1.87.0 AS builder

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y protobuf-compiler

WORKDIR /app
COPY . .
RUN cargo build --release --bin tactica-svc-gateway

FROM gcr.io/distroless/cc AS gateway
COPY --from=builder /app/target/release/tactica-svc-gateway /usr/local/bin/tactica-svc-gateway
ENTRYPOINT ["/usr/local/bin/tactica"]
