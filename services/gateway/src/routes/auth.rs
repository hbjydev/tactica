use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use tactica_proto::v1::auth::{auth_service_client::AuthServiceClient, LoginRequest};
use tonic::transport::Channel;
use tactica_result::{create_error, Result};

use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
}

#[derive(Deserialize)]
struct GwLoginRequest {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct GwLoginResponse {
    access_token: String,
    refresh_token: String,
}

#[axum::debug_handler]
async fn login(
    State(mut client): State<AuthServiceClient<Channel>>,
    Json(body): Json<GwLoginRequest>,
) -> Result<impl IntoResponse> {
    let resp = client.login(LoginRequest {
        username: body.username,
        password: body.password,
    })
        .await
        .map_err(|status| {
            tracing::error!(status = ?status, msg = ?status.message(), "error sending login request");
            create_error!(InternalError)
        })?;

    let body = resp.get_ref();

    Ok((StatusCode::OK, Json(GwLoginResponse {
        access_token: body.access_token.clone(),
        refresh_token: body.request_token.clone(),
    })))
}
