use clap::Parser;
use tactica_proto::v1::auth::auth_service_server::AuthServiceServer;
use tactica_result::Success;
use tonic::transport::Server;
use tracing::Level;

mod db;
mod r#impl;

#[derive(Parser)]
#[command(version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
pub struct Cli {
    #[arg(default_value_t = Level::INFO, global = true, long, short)]
    log_level: Level,
}

#[tokio::main]
async fn main() -> Success {
    let Cli { log_level } = Cli::parse();
    tactica_telemetry::setup_tracing(log_level)?;

    let bind_addr = String::from("");
    let addr = bind_addr.parse()?;

    let auth_svc = r#impl::AuthServiceImpl {};

    let _conn = db::connect().await?;

    tracing::info!(?bind_addr, "server starting");

    Ok(Server::builder()
        .add_service(AuthServiceServer::new(auth_svc))
        .serve(addr)
        .await?)
}
