// import express from 'express';
// import dotenv from 'dotenv';
// import sequelize from './db.js';
// import User from './models/User.js';

// dotenv.config();

// const app = express();
// app.use(express.json());

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Database connected successfully.');

//     await sequelize.sync({ alter: true });
//     console.log('✅ Models synced.');

//     const users = await User.findAll();
//     console.log('Users:', users.map(u => u.toJSON()));

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
//     });
//   } catch (err) {
//     console.error('❌ Database connection error:', err);
//   }
// })();
