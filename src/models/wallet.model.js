import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js'; 

class Wallet extends Model {}

Wallet.init({
  walletId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,  unique: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  currencyType: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.DECIMAL(30, 10), allowNull: false, defaultValue: 0 },
}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'wallets',
  timestamps: true,
});

Wallet.belongsTo(User, {
  foreignKey: 'userId', 
  as: 'user',
});

  

export default Wallet;
