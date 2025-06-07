use sea_orm::{Database, DatabaseConnection};
use tactica_result::Result;

mod entity;

pub async fn connect() -> Result<DatabaseConnection> {
    Ok(
        Database::connect(
            std::env::var("TACTICA_DB_URL")?,
        ).await?
    )
}
