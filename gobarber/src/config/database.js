module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    port: '5433',
    // port: '5432',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
