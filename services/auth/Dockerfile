FROM rust:1.87.0 AS builder

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y protobuf-compiler

WORKDIR /app
COPY . .
RUN cargo build --release --bin tactica-svc-auth

FROM gcr.io/distroless/cc AS auth
COPY --from=builder /app/target/release/tactica-svc-auth /usr/local/bin/tactica-svc-auth
ENTRYPOINT ["/usr/local/bin/tactica"]
