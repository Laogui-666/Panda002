module.exports = {
  apps: [
    {
      name: 'Panda001',
      script: './ecosystem.start.sh',
      cwd: '/www/wwwroot/Panda001',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        SILICONFLOW_API_KEY: 'sk-icpevgyimcputmrulscwaebswfyzbckuleiiyhqfowucttwy'
      }
    }
  ]
}
