mod command;

#[tokio::main]
async fn main() {
    command::run().await.expect("failed to run tactica");
}
