// // Database initialization script
// import { query } from '../src/configs/db.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// async function initializeDatabase() {
//   try {
//     console.log('🚀 Initializing database...');
    
//     // Read and execute schema file
//     const schemaPath = path.join(__dirname, '../database/schema.sql');
//     const schema = fs.readFileSync(schemaPath, 'utf8');
    
//     // Split schema into individual statements
//     const statements = schema
//       .split(';')
//       .map(stmt => stmt.trim())
//       .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
//     // Execute each statement
//     for (const statement of statements) {
//       if (statement.trim()) {
//         try {
//           await query(statement);
//           console.log('✅ Executed:', statement.substring(0, 50) + '...');
//         } catch (error) {
//           // Ignore errors for statements that might already exist
//           if (!error.message.includes('already exists') && 
//               !error.message.includes('duplicate key')) {
//             console.warn('⚠️  Warning:', error.message);
//           }
//         }
//       }
//     }
    
//     console.log('🎉 Database initialized successfully!');
//     console.log('📊 Sample data has been inserted.');
//     console.log('👤 Admin user: admin@ticketbooking.com');
//     console.log('👤 Test user: user@example.com');
//     console.log('🔑 Password for both: password123');
    
//   } catch (error) {
//     console.error('❌ Database initialization failed:', error.message);
//     process.exit(1);
//   }
// }

// // Run initialization if this script is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   initializeDatabase();
// }

// export default initializeDatabase;
