use std::fmt::Display;

use axum::Json;

#[cfg(feature = "serde")]
extern crate serde;

#[cfg(feature = "axum")]
extern crate axum;

#[cfg(feature = "axum")]
extern crate http;

type Result<T, E = Error> = std::result::Result<T, E>;

/// An alias for [Result] that defaults to using `()` as a return type.
pub type Success = Result<()>;

#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Deserialize, serde::Serialize))]
pub struct Error {
    pub error_type: ErrorType,
    pub location: String,
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?} occurred in {}", self.error_type, self.location)
    }
}

impl std::error::Error for Error {}

#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Deserialize, serde::Serialize))]
#[cfg_attr(feature = "serde", serde(tag = "error"))]
pub enum ErrorType {
    InternalError,
}

#[cfg(feature = "axum")]
impl axum::response::IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let status = match self.error_type {
            ErrorType::InternalError => http::StatusCode::INTERNAL_SERVER_ERROR,
        };

        (status, Json(&self)).into_response()
    }
}

/// Create a new error given a type and any arguments needed.
#[macro_export]
macro_rules! create_error {
    ($error: ident $( $tt:tt )?) => {
        $crate::Error {
            error_type: $crate::ErrorType::$error $( $tt )?,
            location: format!("{}:{}:{}", file!(), line!(), column!()),
        }
    };
}

#[cfg(test)]
mod tests {
    use super::ErrorType;

    #[test]
    fn use_macro_to_construct_error() {
        let error = create_error!(InternalError);
        assert!(matches!(error.error_type, ErrorType::InternalError));
    }
}
