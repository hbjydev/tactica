use std::net::SocketAddr;

use axum::Router;
use state::AppState;
use tactica_proto::v1::auth::auth_service_client::AuthServiceClient;
use tactica_result::Success;
use tokio::net::TcpListener;

mod routes;
mod state;

pub async fn start(bind_addr: String) -> Success {
    let addr: SocketAddr = bind_addr.parse()?;

    let router = Router::new()
        .merge(routes::auth::router())
        .with_state(AppState {
            auth_client: AuthServiceClient::connect("http://127.0.0.1:50051")
                .await
                .expect("failed to create auth service client"),
        });

    let listener = TcpListener::bind(addr).await?;

    tracing::info!(
        listen_addr = ?listener.local_addr().unwrap(),
        "server listening",
    );

    Ok(axum::serve(listener, router).await?)
}
