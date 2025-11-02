// Trip model for bus routes and schedules
import { query } from '../configs/db.js';

export class Trip {
  constructor(tripData) {
    this.id = tripData.id;
    this.busId = tripData.bus_id;
    this.busName = tripData.bus_name;
    this.busNumber = tripData.bus_number;
    this.operator = tripData.operator;
    this.fromCity = tripData.from_city;
    this.toCity = tripData.to_city;
    this.departureTime = tripData.departure_time;
    this.arrivalTime = tripData.arrival_time;
    this.duration = tripData.duration;
    this.distance = tripData.distance;
    this.basePrice = tripData.base_price;
    this.totalSeats = tripData.total_seats;
    this.availableSeats = tripData.available_seats;
    this.busType = tripData.bus_type;
    this.amenities = tripData.amenities;
    this.isActive = tripData.is_active;
    this.createdAt = tripData.created_at;
    this.updatedAt = tripData.updated_at;
  }

  // Create a new trip
  static async create(tripData) {
    const {
      busId,
      busName,
      busNumber,
      operator,
      fromCity,
      toCity,
      departureTime,
      arrivalTime,
      duration,
      distance,
      basePrice,
      totalSeats,
      busType,
      amenities = []
    } = tripData;

    const queryText = `
      INSERT INTO trips (
        bus_id, bus_name, bus_number, operator, from_city, to_city,
        departure_time, arrival_time, duration, distance, base_price,
        total_seats, available_seats, bus_type, amenities
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      busId,
      busName,
      busNumber,
      operator,
      fromCity,
      toCity,
      departureTime,
      arrivalTime,
      duration,
      distance,
      basePrice,
      totalSeats,
      totalSeats, // available_seats starts same as total_seats
      busType,
      JSON.stringify(amenities)
    ];

    try {
      const result = await query(queryText, values);
      return new Trip(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find trip by ID
  static async findById(id) {
    const queryText = 'SELECT * FROM trips WHERE id = $1 AND is_active = true';
    try {
      const result = await query(queryText, [id]);
      return result.rows.length > 0 ? new Trip(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Search details for Filter

  static async getFiltersForRoute(fromCity, toCity) {
    // Base WHERE clause for all queries
    const whereClause = 'WHERE is_active = true AND from_city ILIKE $1 AND to_city ILIKE $2';
    const values = [`%${fromCity}%`, `%${toCity}%`];

    try {
      // 1. Get Price Range
      const priceQuery = `SELECT MIN(base_price) as "minPrice", MAX(base_price) as "maxPrice" FROM trips ${whereClause}`;
      
      // 2. Get distinct Bus Types
      const busTypesQuery = `SELECT DISTINCT bus_type FROM trips ${whereClause} ORDER BY bus_type`;
      
      // 3. Get distinct Companies (Operators)
      const companiesQuery = `SELECT DISTINCT operator FROM trips ${whereClause} ORDER BY operator`;
      
      // 4. Get distinct Amenities (assuming a JSONB array column)
      const amenitiesQuery = `SELECT DISTINCT TRIM(unnest(string_to_array(amenities, ','))) AS amenity FROM trips ${whereClause} ORDER BY amenity`;
      
      // Run all queries in parallel for efficiency
      const [
        priceResult,
        busTypesResult,
        companiesResult,
        amenitiesResult
      ] = await Promise.all([
        query(priceQuery, values),
        query(busTypesQuery, values),
        query(companiesQuery, values),
        query(amenitiesQuery, values)
      ]);

      // Format the results into a clean object
      const filters = {
        priceRange: priceResult.rows[0] || { minPrice: 0, maxPrice: 5000 },
        busTypes: busTypesResult.rows.map(row => row.bus_type),
        companies: companiesResult.rows.map(row => row.operator),
        amenities: amenitiesResult.rows.map(row => row.amenity)
      };

      return filters;

    } catch (error) {
      console.error('Error in Trip.getFiltersForRoute:', error.message);
      throw error;
    }
  }

  // Search trips by route and date

  static async searchTrips(searchParams) {
    const {
     fromCity,
      toCity,
      departureDate,
      passengers,
      minPrice,
      maxPrice,
      busTypes,   
      companies,  
      amenities,  
      busType, 
      sortBy,
      sortOrder,
      limit,
      offset
    } = searchParams;

    const conditions = [];
    const values = [];
    let placeholderIndex = 1;

    let queryText = 'SELECT * FROM trips WHERE is_active = true';

    if (fromCity) {
      conditions.push(`from_city ILIKE $${placeholderIndex++}`);
      values.push(`%${fromCity}%`);
    }

    if (toCity) {
      conditions.push(`to_city ILIKE $${placeholderIndex++}`);
      values.push(`%${toCity}%`);
    }

    if (passengers) {
      conditions.push(`available_seats >= $${placeholderIndex++}`);
      values.push(passengers);
    }
    
    if (typeof minPrice === 'number') {
      conditions.push(`base_price >= $${placeholderIndex++}`);
      values.push(minPrice);
    }
    if (typeof maxPrice === 'number') {
      conditions.push(`base_price <= $${placeholderIndex++}`);
      values.push(maxPrice);
    }

    if (departureDate) {
      conditions.push(`($${placeholderIndex++}::date + departure_time::time) > (NOW() + INTERVAL '1 hour')`);
      values.push(departureDate);
    }

    if (busType) {
      conditions.push(`bus_type = $${placeholderIndex++}`);
      values.push(busType);
    }

    if (Array.isArray(busTypes) && busTypes.length > 0) {
      const placeholders = busTypes.map(() => `$${placeholderIndex++}`).join(',');
      conditions.push(`bus_type IN (${placeholders})`);
      values.push(...busTypes);
    }
    
    if (conditions.length > 0) {
      queryText += ' AND ' + conditions.join(' AND ');
    }

    try {
      const result = await query(queryText, values);
      return result.rows;
    } catch (error) {
      console.error('Error in Trip.searchTrips:', error);
      throw error;
    }
  }


  // Get all trips with pagination
  static async getAllTrips(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const queryText = `
      SELECT * FROM trips 
      WHERE is_active = true 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await query(queryText, [limit, offset]);
      return result.rows.map(row => new Trip(row));
    } catch (error) {
      throw error;
    }
  }

  // Update trip
  static async update(id, updateData) {
    const {
      busName,
      busNumber,
      operator,
      fromCity,
      toCity,
      departureTime,
      arrivalTime,
      duration,
      distance,
      basePrice,
      totalSeats,
      busType,
      amenities
    } = updateData;

    const queryText = `
      UPDATE trips 
      SET bus_name = COALESCE($1, bus_name),
          bus_number = COALESCE($2, bus_number),
          operator = COALESCE($3, operator),
          from_city = COALESCE($4, from_city),
          to_city = COALESCE($5, to_city),
          departure_time = COALESCE($6, departure_time),
          arrival_time = COALESCE($7, arrival_time),
          duration = COALESCE($8, duration),
          distance = COALESCE($9, distance),
          base_price = COALESCE($10, base_price),
          total_seats = COALESCE($11, total_seats),
          bus_type = COALESCE($12, bus_type),
          amenities = COALESCE($13, amenities),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const values = [
      busName,
      busNumber,
      operator,
      fromCity,
      toCity,
      departureTime,
      arrivalTime,
      duration,
      distance,
      basePrice,
      totalSeats,
      busType,
      amenities ? JSON.stringify(amenities) : null,
      id
    ];

    try {
      const result = await query(queryText, values);
      return result.rows.length > 0 ? new Trip(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Update available seats
  static async updateAvailableSeats(id, seatChange) {
    const queryText = `
      UPDATE trips 
      SET available_seats = available_seats + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND available_seats + $1 >= 0
      RETURNING *
    `;

    try {
      const result = await query(queryText, [seatChange, id]);
      return result.rows.length > 0 ? new Trip(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Deactivate trip
  static async deactivate(id) {
    const queryText = `
      UPDATE trips 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await query(queryText, [id]);
      return result.rows.length > 0 ? new Trip(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get popular routes
  static async getPopularRoutes(limit = 10) {
    const queryText = `
      SELECT from_city, to_city, COUNT(*) as trip_count
      FROM trips 
      WHERE is_active = true
      GROUP BY from_city, to_city
      ORDER BY trip_count DESC
      LIMIT $1
    `;

    try {
      const result = await query(queryText, [limit]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get available bus types
  static async getBusTypes() {
    const queryText = `
      SELECT DISTINCT bus_type 
      FROM trips 
      WHERE is_active = true
      ORDER BY bus_type
    `;

    try {
      const result = await query(queryText);
      return result.rows.map(row => row.bus_type);
    } catch (error) {
      throw error;
    }
  }

  // Check if trip has enough seats
  static async hasEnoughSeats(id, requiredSeats) {
    const queryText = 'SELECT available_seats FROM trips WHERE id = $1';
    try {
      const result = await query(queryText, [id]);
      if (result.rows.length === 0) return false;
      return result.rows[0].available_seats >= requiredSeats;
    } catch (error) {
      throw error;
    }
  }
}
