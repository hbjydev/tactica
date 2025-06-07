use tactica_proto::v1::auth::{
    LoginRequest, LoginResponse, auth_service_server::AuthService,
};
use tonic::{Request, Response, Result, async_trait};

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
