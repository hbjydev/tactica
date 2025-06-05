use tactica_proto::v1::auth::{auth_service_server::{AuthService, AuthServiceServer}, LoginRequest, LoginResponse};
use tonic::{async_trait, transport::Server, Request, Response, Result};

struct AuthServiceImpl {}

#[async_trait]
impl AuthService for AuthServiceImpl {
    async fn login(&self, _req: Request<LoginRequest>) -> Result<Response<LoginResponse>> {
        Ok(Response::new(LoginResponse {
            access_token: String::new(),
            request_token: String::new(),
        }))
    }
}

pub async fn start(bind_addr: String) {
    tactica_telemetry::setup_tracing("auth").expect("failed to set up tracing");
    let addr = bind_addr.parse().expect("invalid bind address");

    let auth_svc = AuthServiceImpl {};

    tracing::info!(?bind_addr, "server starting");
    Server::builder()
        .add_service(AuthServiceServer::new(auth_svc))
        .serve(addr)
        .await
        .expect("failed to serve");
}
