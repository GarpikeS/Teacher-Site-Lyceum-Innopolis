import { db } from '../../config/database';
import { User, UpdateUserDto } from '@code-platform/shared-types';

const USER_COLUMNS = `
  id, email, role, first_name as "firstName", last_name as "lastName",
  avatar_url as "avatarUrl", is_active as "isActive",
  is_email_verified as "isEmailVerified",
  created_at as "createdAt", updated_at as "updatedAt",
  last_login_at as "lastLoginAt", metadata
`;

export class UsersModel {
  static async findAll(
    page: number = 1,
    limit: number = 20,
    role?: string
  ): Promise<{ users: User[]; total: number }> {
    const whereClause = role ? 'WHERE role = $1' : '';
    const countParams = role ? [role] : [];

    const countResult = await db.query<{ total: string }>(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      countParams
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const offset = (page - 1) * limit;
    let dataQuery: string;
    let dataParams: any[];

    if (role) {
      dataQuery = `
        SELECT ${USER_COLUMNS}
        FROM users
        WHERE role = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      dataParams = [role, limit, offset];
    } else {
      dataQuery = `
        SELECT ${USER_COLUMNS}
        FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      dataParams = [limit, offset];
    }

    const result = await db.query<User>(dataQuery, dataParams);
    return { users: result.rows, total };
  }

  static async findById(id: string): Promise<User | null> {
    const result = await db.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await db.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  static async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (dto.firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(dto.firstName);
    }
    if (dto.lastName !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(dto.lastName);
    }
    if (dto.avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      values.push(dto.avatarUrl);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const result = await db.query<User>(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING ${USER_COLUMNS}`,
      values
    );

    return result.rows[0] || null;
  }

  static async updateRole(id: string, role: string): Promise<User | null> {
    const result = await db.query<User>(
      `UPDATE users SET role = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING ${USER_COLUMNS}`,
      [id, role]
    );
    return result.rows[0] || null;
  }

  static async setActive(id: string, isActive: boolean): Promise<User | null> {
    const result = await db.query<User>(
      `UPDATE users SET is_active = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING ${USER_COLUMNS}`,
      [id, isActive]
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }

  static async getPublicStats(): Promise<{ totalUsers: number; totalStudents: number; totalTeachers: number }> {
    const result = await db.query<{ total: string; students: string; teachers: string }>(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE role = 'student') as students,
        COUNT(*) FILTER (WHERE role = 'teacher') as teachers
      FROM users
      WHERE is_active = true
    `);
    const row = result.rows[0];
    return {
      totalUsers: parseInt(row.total, 10),
      totalStudents: parseInt(row.students, 10),
      totalTeachers: parseInt(row.teachers, 10),
    };
  }
}
