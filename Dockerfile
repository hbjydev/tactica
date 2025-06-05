FROM rust:1.87.0 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM gcr.io/distroless/cc AS auth
COPY --from=builder /app/target/release/tactica /usr/local/bin/tactica
ENTRYPOINT ["/usr/local/bin/tactica"]
