import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.model.js';

class Order extends Model { }

Order.init({
    orderId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    walletId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    currencyType: { type: DataTypes.STRING, allowNull: false },
    currencyRecieve: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(30, 10), allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
},
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
    }
);


Order.belongsTo(User, {
    foreignKey: 'userId', 
    as: 'user',
});


export default Order;