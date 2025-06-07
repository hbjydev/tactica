use std::net::SocketAddr;

use clap::{Args, Parser, Subcommand};
use tactica_proto::v1::auth::auth_service_server::AuthServiceServer;
use tactica_result::Success;
use tonic::transport::Server;
use tracing::Level;

mod db;
mod r#impl;

#[derive(Args)]
pub struct StartArgs {
    /// The address the auth service will bind on.
    #[arg(default_value = "[::1]:50051", long, short)]
    bind_addr: SocketAddr,
}

#[derive(Subcommand)]
pub enum Command {
    /// Starts the Auth service
    Start(StartArgs),

    /// Runs Auth service migrations
    Migrate,
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
    #[arg(default_value = "postgres://tactica:tactica@127.0.0.1:5432/tactica-auth", global = true, long, short)]
    database_url: String,
}

#[tokio::main]
async fn main() -> Success {
    let Cli { command, database_url, log_level } = Cli::parse();
    tactica_telemetry::setup_tracing(log_level)?;

    match command {
        Command::Start(StartArgs { bind_addr }) => {
            let auth_svc = r#impl::AuthServiceImpl {};
            let _conn = db::connect(database_url).await?;

            tracing::info!(?bind_addr, "server starting");
            Ok(Server::builder()
                .add_service(AuthServiceServer::new(auth_svc))
                .serve(bind_addr)
                .await?)
        },
        Command::Migrate => panic!("not implemented!"),
    }
}
