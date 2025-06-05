pub mod v1 {
    pub mod auth {
        #[cfg(any(feature = "auth-client", feature = "auth-server"))]
        tonic::include_proto!("tactica.v1.auth");
    }
}
