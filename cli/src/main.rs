use clap::{Subcommand, Parser};

#[derive(Parser)]
#[command(version = env!("CARGO_PKG_VERSION"), about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Parser)]
struct GatewayArgs {
    /// The address to listen on
    #[arg(default_value = "0.0.0.0:50050")]
    bind_addr: String,

    /// The address Auth is listening on
    #[arg(default_value = "http://127.0.0.1:50051")]
    auth_addr: String,
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
    Gateway(GatewayArgs),
}

#[tokio::main]
async fn main() {
    match Cli::parse().command {
        Commands::Auth { bind_addr } => {
            tactica_svc_auth::start(bind_addr).await;
        },

        Commands::Gateway(args) => {
            tactica_svc_gateway::start(args.bind_addr, args.auth_addr).await;
        }
    }
}
