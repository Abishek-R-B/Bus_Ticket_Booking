// User model for authentication and user management
import bcrypt from 'bcrypt';
import { query } from '../configs/db.js';

export class User {


  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password;
    this.firstName = userData.first_name;
    this.lastName = userData.last_name;
    this.phone = userData.phone;
    this.dateOfBirth = userData.date_of_birth;
    this.gender = userData.gender;
    this.isActive = userData.is_active;
    this.role = userData.role;
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  // Create a new user
  static async create(userData) {
    console.log('--- Model (DEBUG V2) ---');
    console.log('The full object received by User.create is:', userData);

    // Let's explicitly check if the 'phone' property exists on the object
    if (!userData.hasOwnProperty('phone')) {
        console.error('CRITICAL ERROR: The userData object DOES NOT have a "phone" property.');
        // We will throw a more specific error to be sure
        throw new Error('The phone property was missing from the object passed to User.create.');
    }
     
    console.log('The phone value is:', userData.phone);
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      role = 'user'
    } = userData;

// Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const queryText = `
      INSERT INTO users (email, password, first_name, last_name, phone, date_of_birth, gender, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
// We are now using the properties directly from the userData object
    const values = [
      userData.email, 
      hashedPassword, 
      userData.firstName, 
      userData.lastName, 
      userData.phone, // Using userData.phone directly, bypassing destructuring
      userData.dateOfBirth, 
      userData.gender, 
      userData.role || 'user'
    ];

console.log('Attempting to execute query with these values:', values);

    try {
      const result = await query(queryText, values);
      return new User(result.rows[0]);
    } catch (error) {
      console.error("Error during database insertion in User.create:", error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    try {
      const result = await query(queryText, [email]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const queryText = 'SELECT * FROM users WHERE id = $1';
    try {
      const result = await query(queryText, [id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async update(id, updateData) {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender
    } = updateData;

    const queryText = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone = COALESCE($3, phone),
          date_of_birth = COALESCE($4, date_of_birth),
          gender = COALESCE($5, gender),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      firstName, 
      lastName, 
      phone, 
      dateOfBirth, 
      gender, 
      id
    ];

    try {
      const result = await query(queryText, values);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const queryText = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    try {
      const result = await query(queryText, [hashedPassword, id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Get user without sensitive data
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Check if user exists by email
  static async exists(email) {
    const queryText = 'SELECT id FROM users WHERE email = $1';
    try {
      const result = await query(queryText, [email]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Deactivate user account
  static async deactivate(id) {
    const queryText = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await query(queryText, [id]);
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}
