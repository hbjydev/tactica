pub mod v1 {
    pub mod auth {
        #[cfg(feature = "auth-client")]
        tonic::include_proto!("tactica.v1.auth");
    }
}
