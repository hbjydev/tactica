use sea_orm::{Database, DatabaseConnection};
use tactica_result::Result;

mod entity;

pub async fn connect(database_url: String) -> Result<DatabaseConnection> {
    Ok(Database::connect(database_url).await?)
}
