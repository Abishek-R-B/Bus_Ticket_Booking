// // Database connection test script
// import { query, dbPool } from '../src/configs/db.js';

// async function testDatabaseConnection() {
//   try {
//     console.log('🔍 Testing database connection...');
    
//     // Test basic connection
//     const client = await dbPool.connect();
//     console.log('✅ Database connection successful!');
    
//     // Test query execution
//     const result = await query('SELECT NOW() as current_time');
//     console.log('✅ Query execution successful!');
//     console.log('📅 Current database time:', result.rows[0].current_time);
    
//     // Test table existence
//     const tablesResult = await query(`
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public' 
//       AND table_type = 'BASE TABLE'
//       ORDER BY table_name
//     `);
    
//     console.log('📋 Available tables:');
//     tablesResult.rows.forEach(row => {
//       console.log(`  - ${row.table_name}`);
//     });
    
//     // Test users table
//     const usersCount = await query('SELECT COUNT(*) as count FROM users');
//     console.log(`👥 Users in database: ${usersCount.rows[0].count}`);
    
//     // Test trips table
//     const tripsCount = await query('SELECT COUNT(*) as count FROM trips');
//     console.log(`🚌 Trips in database: ${tripsCount.rows[0].count}`);
    
//     // Test bookings table
//     const bookingsCount = await query('SELECT COUNT(*) as count FROM bookings');
//     console.log(`🎫 Bookings in database: ${bookingsCount.rows[0].count}`);
    
//     // Test sample data
//     const sampleUser = await query('SELECT email, first_name, last_name FROM users LIMIT 1');
//     if (sampleUser.rows.length > 0) {
//       console.log('👤 Sample user:', sampleUser.rows[0]);
//     }
    
//     const sampleTrip = await query('SELECT bus_name, from_city, to_city FROM trips LIMIT 1');
//     if (sampleTrip.rows.length > 0) {
//       console.log('🚌 Sample trip:', sampleTrip.rows[0]);
//     }
    
//     client.release();
//     console.log('🎉 Database test completed successfully!');
    
//   } catch (error) {
//     console.error('❌ Database test failed:', error.message);
//     console.error('Stack trace:', error.stack);
//     process.exit(1);
//   }
// }

// // Run test if this script is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   testDatabaseConnection();
// }

// export default testDatabaseConnection;
