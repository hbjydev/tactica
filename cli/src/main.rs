use clap::{Subcommand, Parser};

#[derive(Parser)]
#[command(version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Run the auth service
    Auth {
        /// The address to listen on
        #[arg(default_value = "0.0.0.0:50051")]
        bind_addr: String,
    },

    /// Run the gateway service
    Gateway {
        /// The address to listen on
        #[arg(default_value = "0.0.0.0:50050")]
        bind_addr: String,

        /// The address Auth is listening on
        #[arg(default_value = "http://127.0.0.1:50051")]
        auth_addr: String,
    },
}

#[tokio::main]
async fn main() {
    match Cli::parse().command {
        Commands::Auth { bind_addr } => {
            tactica_svc_auth::start(bind_addr).await;
        },
        Commands::Gateway { bind_addr, auth_addr } => {
            tactica_svc_gateway::start(bind_addr, auth_addr).await;
        }
    }
}
