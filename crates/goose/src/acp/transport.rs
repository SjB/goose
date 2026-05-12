use agent_client_protocol_http::{AcpHttpServer, ServerOptions};
use axum::Router;

use crate::acp::server_factory::AcpAgentFactory;

pub fn create_router(factory: AcpAgentFactory, secret_key: String) -> Router {
    let server = AcpHttpServer::new(factory.into_factory()).with_options(ServerOptions {
        path: "/acp".to_string(),
        permissive_cors: true,
        health_endpoint: true,
    });

    server
        .into_router()
        .merge(super::mcp_app_proxy::routes(secret_key))
}
