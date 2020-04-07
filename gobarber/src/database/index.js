import mongoose from 'mongoose';
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map((model) => model.init(this.connection))
            .map(
                (model) =>
                    model.associate && model.associate(this.connection.models)
            );
    }

    mongo() {
        this.connection = mongoose.connect(
            process.env.MONGO_URL,
            // { useNewUrlParser: true, useFindAndModify: true }
            // Warning: vai ser depreciado.
            // node:32110) DeprecationWarning: current Server Discovery
            // and Monitoring engine is deprecated, and will be removed
            // in a future version. To use the new Server Discover and
            // Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
            }
        );
    }
}

export default new Database();
