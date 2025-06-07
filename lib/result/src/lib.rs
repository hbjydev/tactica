#[cfg(feature = "sea-orm")]
extern crate sea_orm;

#[cfg(feature = "serde")]
extern crate serde;

#[cfg(feature = "axum")]
extern crate axum;

#[cfg(feature = "axum")]
extern crate http;

#[cfg(feature = "tonic")]
extern crate tonic;

pub type Result<T, E = Error> = anyhow::Result<T, E>;

/// An alias for [Result] that defaults to using `()` as a return type.
pub type Success = Result<()>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("env var error: {0}")]
    EnvErr(#[from] std::env::VarError),

    #[cfg(feature = "sea-orm")]
    #[error("DB error: {0}")]
    DbErr(#[from] sea_orm::DbErr),

    #[cfg(feature = "tonic")]
    #[error("grpc error: {0}")]
    GrpcErr(#[from] tonic::Status),

    #[cfg(feature = "tonic")]
    #[error("tonic transport error: {0}")]
    BindErr(#[from] tonic::transport::Error),

    #[error("failed to parse addr: {0}")]
    AddrParseErr(#[from] std::net::AddrParseError),

    #[error("i/o error: {0}")]
    IoErr(#[from] std::io::Error),

    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

#[cfg(feature = "axum")]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
struct ErrorResponse {
    pub message: String,
}

#[cfg(feature = "axum")]
impl axum::response::IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        use axum::Json;

        let msg = self.to_string();
        let status = match self {
            _ => http::StatusCode::INTERNAL_SERVER_ERROR,
        };

        (status, Json(ErrorResponse {
            message: msg,
        })).into_response()
    }
}
