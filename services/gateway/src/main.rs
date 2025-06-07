use std::net::SocketAddr;

use clap::{Args, Parser, Subcommand};
use axum::Router;
use state::AppState;
use tactica_proto::v1::auth::auth_service_client::AuthServiceClient;
use tactica_result::Success;
use tokio::net::TcpListener;
use tracing::Level;

mod routes;
mod state;

#[derive(Args)]
pub struct StartArgs {
    /// The address the auth service will bind on.
    #[arg(default_value = "[::1]:50050", long, short)]
    bind_addr: SocketAddr,
}

#[derive(Subcommand)]
pub enum Command {
    /// Starts the Auth service
    Start(StartArgs),
}

#[derive(Parser)]
#[command(version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    command: Command,

    /// The minimum logging level
    #[arg(default_value_t = Level::INFO, global = true, long, short)]
    log_level: Level,

    /// The URL of the Postgres service to use.
    #[arg(default_value = "http://127.0.0.1:50051", global = true, long, short)]
    auth_url: String,
}

#[tokio::main]
async fn main() -> Success {
    let Cli { command, log_level, auth_url } = Cli::parse();
    tactica_telemetry::setup_tracing(log_level)?;

    match command {
        Command::Start(StartArgs { bind_addr }) => {
            let router = Router::new()
                .merge(routes::auth::router())
                .with_state(AppState {
                    auth_client: AuthServiceClient::connect(auth_url)
                        .await
                        .expect("failed to create auth service client"),
                });

            let listener = TcpListener::bind(bind_addr).await?;

            tracing::info!(
                listen_addr = ?listener.local_addr().unwrap(),
                "server listening",
            );

            Ok(axum::serve(listener, router).await?)
        }
    }
}
