// // Environment variables check script
// import 'dotenv/config';

// console.log('🔍 Checking environment variables...\n');

// const requiredVars = [
//   'DATABASE_URL',
//   'JWT_SECRET',
//   'JWT_REFRESH_SECRET',
//   'PORT'
// ];

// let allPresent = true;

// console.log('Required environment variables:');
// requiredVars.forEach(varName => {
//   const value = process.env[varName];
//   if (value) {
//     console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***hidden***' : value}`);
//   } else {
//     console.log(`❌ ${varName}: NOT SET`);
//     allPresent = false;
//   }
// });

// console.log('\nOptional environment variables:');
// const optionalVars = ['JWT_EXPIRES_IN', 'NODE_ENV', 'CORS_ORIGIN'];
// optionalVars.forEach(varName => {
//   const value = process.env[varName];
//   if (value) {
//     console.log(`✅ ${varName}: ${value}`);
//   } else {
//     console.log(`⚠️  ${varName}: NOT SET (using default)`);
//   }
// });

// if (!allPresent) {
//   console.log('\n❌ Missing required environment variables!');
//   console.log('\n📝 To fix this:');
//   console.log('1. Copy .env.example to .env:');
//   console.log('   cp .env.example .env');
//   console.log('\n2. Edit .env file with your database credentials:');
//   console.log('   DATABASE_URL=postgresql://username:password@localhost:5432/ticket_booking_db');
//   console.log('   JWT_SECRET=your_super_secret_jwt_key_here');
//   console.log('   JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here');
//   console.log('   PORT=5000');
//   console.log('\n3. Make sure PostgreSQL is running and the database exists');
// } else {
//   console.log('\n✅ All required environment variables are set!');
//   console.log('\n🚀 You can now run:');
//   console.log('   npm run init:db  # Initialize database');
//   console.log('   npm run test:db  # Test database connection');
//   console.log('   npm run dev      # Start development server');
// }
