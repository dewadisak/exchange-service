import Currency from '../models/currency.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Wallet from '../models/wallet.model.js';
import Transaction from '../models/transaction.model.js';


const updateWalletBalance = async (walletId, currencyType, newBalance) => {
    await Wallet.update({ balance: newBalance }, { where: { walletId, currencyType } });
};


const createTransactionRecord = async (fromWalletId, toWalletId, amount, currencyType, transactionType, status) => {
    await Transaction.create({
        fromWalletId,
        toWalletId,
        amount,
        currencyType,
        transactionType,
        status,
    });
};

export const createTransactionBuyOrder = async (req, res) => {
    try {
        const { orderId, userId, type, currencyType } = req.body;

        if (type !== 'buy' && type !== 'sell') {
            return res.status(400).json({ message: 'Invalid transaction' });
        }

        const order = await Order.findOne({ where: { orderId } });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status === 'completed') return res.status(400).json({ message: 'Order is completed' });

        const [userBuy, userSell, priceRate] = await Promise.all([
            User.findByPk(userId, { include: [{ model: Wallet, as: 'wallets' }] }),
            User.findByPk(order.userId, { include: [{ model: Wallet, as: 'wallets' }] }),
            Currency.findOne({ where: { currencyType: order.currencyType, convertByType: currencyType } }),
        ]);

        if (!priceRate) return res.status(400).json({ message: 'Currency conversion not supported' });

        const priceByCurrency = priceRate.rate * order.amount;

        const buyerWallets = userBuy.wallets;
        const sellerWallets = userSell.wallets;

        const buyerMainWallet = buyerWallets.find(w => w.currencyType === currencyType);
        const buyerReceiveWallet = buyerWallets.find(w => w.currencyType === order.currencyType);
        const sellerMainWallet = sellerWallets.find(w => w.currencyType === currencyType);
        const sellerReceiveWallet = sellerWallets.find(w => w.currencyType === order.currencyType);
    

        if (!buyerMainWallet || !buyerReceiveWallet || !sellerMainWallet || !sellerReceiveWallet) {
            return res.status(400).json({ message: 'Wallets not properly configured for transaction' });
        }

        if (type === 'buy') {
            if (buyerMainWallet.balance < priceByCurrency) {
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            await Promise.all([
                updateWalletBalance(buyerMainWallet.walletId, currencyType, parseFloat(buyerMainWallet.balance) - parseFloat(priceByCurrency)),
                updateWalletBalance(sellerMainWallet.walletId, currencyType, parseFloat(sellerMainWallet.balance) + parseFloat(priceByCurrency)),
                updateWalletBalance(buyerReceiveWallet.walletId, order.currencyType, parseFloat(buyerReceiveWallet.balance) + parseFloat(order.amount)),
            ]);
        }

        if (type === 'sell') {
            if (sellerReceiveWallet.balance < order.amount) {
                return res.status(400).json({ message: 'Insufficient assets for sale' });
            }
            await Promise.all([
                updateWalletBalance(buyerMainWallet.walletId, currencyType, parseFloat(buyerMainWallet.balance) + parseFloat(priceByCurrency)),
                updateWalletBalance(sellerMainWallet.walletId, currencyType, parseFloat(sellerMainWallet.balance) - parseFloat(priceByCurrency)),
                updateWalletBalance(sellerReceiveWallet.walletId, order.currencyType, parseFloat(sellerReceiveWallet.balance) + parseFloat(order.amount)),
                updateWalletBalance(buyerReceiveWallet.walletId, order.currencyType, parseFloat(buyerReceiveWallet.balance) - parseFloat(order.amount)),
            ]);
        }

        await Promise.all([
            Order.update({ status: 'completed' }, { where: { orderId } }),
            createTransactionRecord(
                sellerMainWallet.walletId,
                buyerMainWallet.walletId,
                order.amount,
                order.currencyType,
                type,
                'completed'
            ),
        ]);

        res.status(200).json({ message: 'Transaction completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTransfer = async (req, res) => {
    try {
        const { userId, walletId, amount, currencyType } = req.body;

        const user = await User.findByPk(userId, { include: [{ model: Wallet, as: 'wallets' }] });
        const senderWallet = user.wallets.find(w => w.currencyType === currencyType);

        if (!senderWallet || senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance or wallet not found' });
        }

        const receiverWallet = await Wallet.findOne({ where: { walletId, currencyType } });
        if (!receiverWallet) return res.status(404).json({ message: 'Receiver wallet not found' });

        await Promise.all([
            updateWalletBalance(senderWallet.walletId, currencyType, parseFloat(senderWallet.balance) - parseFloat(amount)),
            updateWalletBalance(receiverWallet.walletId, currencyType, parseFloat(receiverWallet.balance) + parseFloat(amount)),
        ]);

        await createTransactionRecord(
            senderWallet.walletId,
            receiverWallet.walletId,
            amount,
            currencyType,
            'transfer',
            'completed'
        );

        res.status(200).json({ message: 'Transfer completed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions)
       
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
