import Order from "../models/order.model.js";
import Wallet from "../models/wallet.model.js";
import User from "../models/user.model.js";
import Currency from '../models/currency.model.js';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders)
       
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
export const createOrder = async (req, res) => {
    try {
        const { userId, type, currencyType, currencyRecieve, amount, status } = req.body;
        const user = await User.findByPk(userId, {
            include: [{ model: Wallet, as: 'wallets' }],
        });
        const data = user.toJSON();
        if(type === 'sell'){
            const amoutByCurrencySell = data.wallets.filter(wallets => wallets.currencyType === currencyType);
            let walletId = amoutByCurrencySell[0].walletId;
            if(amoutByCurrencySell[0].balance >= amount){
                const order = await Order.create({
                    userId,
                    walletId,
                    type,
                    currencyType,
                    currencyRecieve,
                    amount,
                    status
                });
                if(order){
                    const balance = amoutByCurrencySell[0].balance - amount;
                    console.log('balance', balance)
                    console.log('walletId', walletId)
                    console.log('currencyType', currencyType)
                    const wallet = await Wallet.update({
                        balance: balance
                    }, {
                        where: { walletId: walletId, currencyType: currencyType }
                    });
                }
            }
        }
        if(type === 'buy'){
            const amoutByCurrencyBuy = data.wallets.filter(wallets => wallets.currencyType === currencyRecieve);
            let walletId = amoutByCurrencyBuy[0].walletId;
            const getPrice = await Currency.findOne({ where: { currencyType: currencyType, convertByType: currencyRecieve } });
            const price = getPrice.toJSON().rate * amount;
            if(amoutByCurrencyBuy[0].balance >= price){
                await Order.create({
                    userId,
                    walletId,
                    type,
                    currencyType,
                    currencyRecieve,
                    amount,
                    status
                });
            }
        }
        
      res.send('Create order');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
