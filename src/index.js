import express from 'express';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import cors from 'cors';
import sequelize from './config/db.js';
import './models/associations.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', userRoutes);
app.use('/order', orderRoutes);
app.use('/transaction', transactionRoutes);

app.listen(3000, async () => {
    try {
      await sequelize.authenticate(); 
      await sequelize.sync();
      console.log('Database synced successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
    console.log('Application started on port 3000!');
  });
  
