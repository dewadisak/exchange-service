import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('dev_database', 'root', 'rootpassword', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export default sequelize;