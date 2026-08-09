module.exports = {
  apps: [{
    name: 'x-nobita-md',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      RESTART_COUNT: '0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    merge_logs: true,
    time: true
  }]
};
