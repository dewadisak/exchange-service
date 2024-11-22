import User from './user.model.js';
import Wallet from './wallet.model.js';
import Order from './order.model.js';
import Transaction from './transaction.model.js';

User.hasMany(Wallet, {
  foreignKey: 'userId', 
  as: 'wallets', 
});

User.hasMany(Order,{
    foreignKey: 'userId', 
    as: 'orders',   
})

Wallet.hasMany(Transaction, {
    foreignKey: 'fromWalletId', 
    as: 'wallets', 
});


