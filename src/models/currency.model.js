import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Currency extends Model { }

Currency.init({
    currencyType: { type: DataTypes.STRING},
    rate: { type: DataTypes.FLOAT, allowNull: false },
    convertByType: { type: DataTypes.STRING, allowNull: false },
 
},
    {
        sequelize,
        modelName: 'Currency',
        tableName: 'currencys',
        timestamps: true,
    }
);


export default Currency;