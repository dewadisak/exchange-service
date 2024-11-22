import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js'; 
import Wallet from './wallet.model.js';


class Transaction extends Model {}

Transaction.init({
    transactionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromWalletId: { type: DataTypes.INTEGER, allowNull: false },
    toWalletId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(30, 10), allowNull: false },
    currencyType: { type: DataTypes.STRING, allowNull: false },
    transactionType: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
},
{
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
});

Transaction.belongsTo(Wallet, {
    foreignKey: 'fromWalletId',
    as: 'wallet',
});

export default Transaction;