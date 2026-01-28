module.exports = {
  apps: [
    {
      name: 'hireyourai',
      // For standalone build, use the server.js from .next/standalone
      script: '.next/standalone/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster', // Enable cluster mode for load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Memory management
      max_memory_restart: '500M', // Restart if memory exceeds 500MB
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart behavior
      min_uptime: '10s', // Consider app started after 10s
      max_restarts: 10, // Max restarts in min_uptime window
      restart_delay: 4000, // Wait 4s between restarts
      autorestart: true,
      watch: false, // Don't watch files in production
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
}
