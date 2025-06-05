use axum::extract::FromRef;
use tactica_proto::v1::auth::auth_service_client::AuthServiceClient;
use tonic::transport::Channel;

#[derive(Clone)]
pub struct AppState {
    pub auth_client: AuthServiceClient<Channel>,
}

impl FromRef<AppState> for AuthServiceClient<Channel> {
    fn from_ref(app_state: &AppState) -> AuthServiceClient<Channel> {
        app_state.auth_client.clone()
    }
}
