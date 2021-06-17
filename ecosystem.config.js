module.exports = {
  apps: [{
    name: "NoFixedAddress",
    script: "src/server.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}