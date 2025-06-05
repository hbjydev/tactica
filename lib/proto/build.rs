fn main() {
    println!("cargo:rerun-if-changed=./src/main.rs");

    build_auth()
}

fn build_auth() {
    tonic_build::configure()
        .build_server(cfg!(feature = "auth-server"))
        .build_client(cfg!(feature = "auth-client"))
        .compile_protos(&["../../proto/auth.proto"], &["../../proto"])
        .expect("failed to build auth");
}
