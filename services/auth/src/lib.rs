use tactica_proto::v1::auth::{auth_service_server::{AuthService, AuthServiceServer}, LoginRequest, LoginResponse};
use tactica_result::{create_error, Success};
use tonic::{async_trait, transport::Server, Request, Response, Result};

pub struct AuthServiceImpl {}

#[async_trait]
impl AuthService for AuthServiceImpl {
    async fn login(&self, _req: Request<LoginRequest>) -> Result<Response<LoginResponse>> {
        Ok(Response::new(LoginResponse {
            access_token: String::new(),
            request_token: String::new(),
        }))
    }
}

pub async fn start(bind_addr: String) -> Success {
    let addr = bind_addr.parse()
        .map_err(|e| {
            tracing::error!(err = ?e, "failed to bind");
            create_error!(InternalError)
        })?;

    let auth_svc = AuthServiceImpl {};

    tracing::info!(?bind_addr, "server starting");

    Server::builder()
        .add_service(AuthServiceServer::new(auth_svc))
        .serve(addr)
        .await
        .map_err(|e| {
            tracing::error!(err = ?e, "failed to serve");
            create_error!(InternalError)
        })
}
