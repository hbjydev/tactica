use axum::Router;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    tactica_telemetry::setup_tracing("auth").expect("failed to set up tracing");

    let app = Router::new();

    let listener = TcpListener::bind("0.0.0.0:50051").await.expect("failed to bind");
    tracing::info!(local_addr = ?listener.local_addr().unwrap(), "server listening");
    axum::serve(listener, app).await.expect("failed to serve axum");
}
