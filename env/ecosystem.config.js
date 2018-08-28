module.exports = {
  apps : [{
    name: 'API',
    script: './src/app.js',
    env: {
      NODE_ENV: "development",
      DB_HOST: "mongodb://Glebasty1:Borzilololoh123@ds247141.mlab.com:47141/node-tut",
      PORT: "3002",
    },
    env_production : {
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: "cluster",
    watch: ["./src"],
    log_type: "json",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    merge_logs: true,
    error_file: "./logs/error_log.json",
    out_file: "./logs/out_log.json"
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
