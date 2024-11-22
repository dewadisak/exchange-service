
import Wallet from '../models/wallet.model.js';
export const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.findAll();
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}