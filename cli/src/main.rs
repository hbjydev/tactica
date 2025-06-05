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
}

#[tokio::main]
async fn main() {
    match Cli::parse().command {
        Commands::Auth { bind_addr } => {
            tactica_svc_auth::start(bind_addr).await;
        },
    }
}
