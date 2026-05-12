use crate::acp::server::{
    AcpProviderFactory, GooseAcpAgent, GooseAcpAgentOptions, GooseAcpHandler,
};
use crate::agents::GoosePlatform;
use crate::source_roots::SourceRoot;
use agent_client_protocol::{component::DynConnectTo, Agent as SacpAgent, Client};
use anyhow::Result;
use std::sync::Arc;

pub struct AcpServerFactoryConfig {
    pub builtins: Vec<String>,
    pub data_dir: std::path::PathBuf,
    pub config_dir: std::path::PathBuf,
    pub goose_platform: GoosePlatform,
    pub additional_source_roots: Vec<SourceRoot>,
}

#[derive(Clone)]
pub struct AcpAgentFactory {
    config: Arc<AcpServerFactoryConfig>,
}

impl AcpAgentFactory {
    pub fn new(config: AcpServerFactoryConfig) -> Self {
        Self {
            config: Arc::new(config),
        }
    }

    pub async fn create_agent(&self) -> Result<GooseAcpAgent> {
        let config_path = self
            .config
            .config_dir
            .join(crate::config::base::CONFIG_YAML_NAME);
        let config = crate::config::Config::new(&config_path, "goose")?;

        let goose_mode = config
            .get_goose_mode()
            .unwrap_or(crate::config::GooseMode::Auto);
        let disable_session_naming = config.get_goose_disable_session_naming().unwrap_or(false);

        let provider_factory: AcpProviderFactory =
            Arc::new(move |provider_name, model_config, extensions| {
                Box::pin(async move {
                    crate::providers::create(&provider_name, model_config, extensions).await
                })
            });

        GooseAcpAgent::new(GooseAcpAgentOptions {
            provider_factory,
            builtins: self.config.builtins.clone(),
            data_dir: self.config.data_dir.clone(),
            config_dir: self.config.config_dir.clone(),
            goose_mode,
            disable_session_naming,
            goose_platform: self.config.goose_platform.clone(),
            additional_source_roots: self.config.additional_source_roots.clone(),
        })
        .await
    }

    pub fn into_factory(self) -> impl Fn() -> DynConnectTo<Client> + Send + Sync + Clone + 'static {
        move || {
            let factory = self.clone();
            let agent = tokio::task::block_in_place(|| {
                tokio::runtime::Handle::current()
                    .block_on(factory.create_agent())
                    .expect("Failed to create agent")
            });

            let handler = GooseAcpHandler {
                agent: Arc::new(agent),
            };

            let builder = SacpAgent.builder().name("goose-acp").with_handler(handler);
            DynConnectTo::new(builder)
        }
    }
}
