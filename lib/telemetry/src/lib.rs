use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

/// Set up logging via the `tracing` crate.
///
/// <div class="warning">
///
/// If no `RUST_LOG` environment variable is provided, defaults to logging all
/// `info` or higher logs.
///
/// </div>
///
/// # Example
///
/// ```
/// tactica_telemetry::setup_tracing("auth");
/// tracing::info!("Hello, world!");
/// // log message: 2025-05-22T16:27:32.634756Z  INFO tactica_auth: Hello, world!
/// ```
pub fn setup_tracing(_svc: &'static str) -> tactica_result::Success {
    //let resource = Resource::builder().with_service_name(svc).build();

    //let tracer = init_tracer(svc, &resource)?;
    //let meter_provider = init_meter(&resource)?;

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or("info,tower_http=debug,axum::rejection=trace".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        //.with(tracing_opentelemetry::layer().with_tracer(tracer))
        //.with(tracing_opentelemetry::MetricsLayer::new(meter_provider))
        .init();

    Ok(())
}
