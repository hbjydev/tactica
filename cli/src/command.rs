use std::process::exit;

use clap::{Parser, Subcommand};
use tactica_result::Success;
use tracing::Level;

#[derive(Parser)]
pub struct GatewayArgs {
    /// The address to listen on
    #[arg(default_value = "0.0.0.0:50050")]
    bind_addr: String,

    /// The address Auth is listening on
    #[arg(default_value = "http://127.0.0.1:50051")]
    auth_addr: String,
}

#[derive(Subcommand)]
pub enum Command {
    /// Run the service
    Start {
        /// The address to listen on
        #[arg(default_value = "0.0.0.0:50051", long, short)]
        bind_addr: String,

        /// The name of the service to start
        service: String,
    },
}

#[derive(Parser)]
#[command(version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
pub struct Cli {
    /// The command to run
    #[command(subcommand)]
    command: Command,

    #[arg(default_value_t = Level::INFO, global = true, long, short)]
    log_level: Level,
}

pub async fn run() -> Success {
    let cli = Cli::parse();

    let Cli { command, log_level } = cli;

    tactica_telemetry::setup_tracing(log_level)?;

    match command {
        Command::Start { bind_addr, service } => {
            match service.as_str() {
                "auth" => {
                    tactica_svc_auth::start(bind_addr).await?;
                }

                "gateway" => {
                    tactica_svc_gateway::start(bind_addr).await?;
                }

                _ => {
                    tracing::error!(service, "invalid service provided");
                    exit(1);
                }
            }

            Ok(())
        }
    }
}
