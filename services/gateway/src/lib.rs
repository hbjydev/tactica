use std::net::SocketAddr;

use state::AppState;
use tactica_proto::v1::auth::auth_service_client::AuthServiceClient;
use tokio::net::TcpListener;
use axum::Router;

mod routes;
mod state;

pub async fn start(bind_addr: String, auth_addr: String) {
    tactica_telemetry::setup_tracing("auth").expect("failed to set up tracing");
    let addr: SocketAddr = bind_addr.parse().expect("invalid bind address");

    let router = Router::new()
        .merge(routes::auth::router())
        .with_state(AppState {
            auth_client: AuthServiceClient::connect(auth_addr).await.expect("failed to create auth service client")
        });

    let listener = TcpListener::bind(addr).await.expect("failed to bind");
    tracing::info!(listen_addr = ?listener.local_addr().unwrap(), "server listening");
    axum::serve(listener, router).await.expect("failed to serve");
}
