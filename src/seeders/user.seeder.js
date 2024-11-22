import User from '../models/user.model.js';
import Wallet from '../models/wallet.model.js';
import sequelize from '../config/db.js';
import Currency from '../models/currency.model.js';

const seedDataUsersAndCurrency = async () => {
  try {
    // await sequelize.sync({ force: true }); 

    const userOne = await User.create({
      name: 'john',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '123456789',
      kycStatus: true,
    });

    await Wallet.bulkCreate([
      { userId: userOne.id, currencyType: 'THB', balance: 1000000000 },
      { userId: userOne.id, currencyType: 'USD', balance: 2000000 },
      { userId: userOne.id, currencyType: 'BTC', balance: 10 },
      { userId: userOne.id, currencyType: 'ETH', balance: 10 },
      { userId: userOne.id, currencyType: 'XRP', balance: 10 },
      { userId: userOne.id, currencyType: 'DOGE', balance: 10 },
    ]);

    const userTwo = await User.create({
        name: 'doe',
        email: 'doe@example.com',
        password: 'password678',
        phoneNumber: '123456789',
        kycStatus: true,
      });
  
      await Wallet.bulkCreate([
        { userId: userTwo.id, currencyType: 'THB', balance: 1000000000 },
        { userId: userTwo.id, currencyType: 'USD', balance: 2000000 },
        { userId: userTwo.id, currencyType: 'BTC', balance: 10 },
        { userId: userTwo.id, currencyType: 'ETH', balance: 10 },
        { userId: userTwo.id, currencyType: 'XRP', balance: 10 },
        { userId: userTwo.id, currencyType: 'DOGE', balance: 10 },
      ]);

    await Currency.bulkCreate([
        { currencyType: 'BTC', rate: 3358545.92, convertByType: 'THB'},
        { currencyType: 'ETH', rate: 108676.85, convertByType: 'THB'},
        { currencyType: 'XRP', rate: 38.53, convertByType: 'THB'},
        { currencyType: 'DOGE', rate: 13.31, convertByType: 'THB'},
        { currencyType: 'BTC', rate: 96914.97, convertByType: 'USD'},
        { currencyType: 'ETH', rate: 313.12, convertByType: 'USD'},
        { currencyType: 'XRP', rate: 1.11, convertByType: 'USD'},
        { currencyType: 'DOGE', rate: 0.39, convertByType: 'USD'},
        { currencyType: 'USD', rate: 34.64, convertByType: 'THB'},
    ]);

    console.log('Seed completed!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await sequelize.close();
  }
};

seedDataUsersAndCurrency();
