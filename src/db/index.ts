import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Tp0dkhfFI3eC@ep-raspy-mouse-ayg7l8jm-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const DEFAULT_EMPLOYEE_DOCUMENTS = [
  { id: 'doc-1', name: 'Aadhaar Card (Original + Photocopy)', isMandatory: true, status: 'Pending' },
  { id: 'doc-2', name: 'PAN Card (Original + Photocopy)', isMandatory: true, status: 'Pending' },
  { id: 'doc-3', name: 'Permanent Address Proof', isMandatory: true, status: 'Pending' },
  { id: 'doc-4', name: 'Current/Temporary Address Proof (if different)', isMandatory: false, status: 'Pending' },
  { id: 'doc-5', name: 'Class 10th Mark Sheet/Certificate', isMandatory: true, status: 'Pending' },
  { id: 'doc-6', name: 'Class 12th Mark Sheet/Certificate', isMandatory: true, status: 'Pending' },
  { id: 'doc-7', name: 'Graduation Mark Sheets (all years/semesters)', isMandatory: false, status: 'Pending' },
  { id: 'doc-8', name: 'Graduation Degree Certificate (if available)', isMandatory: false, status: 'Pending' },
  { id: 'doc-9', name: 'Two recent passport-size photographs', isMandatory: false, status: 'Pending' },
  { id: 'doc-10', name: 'Cancelled Cheque (or first page of bank passbook)', isMandatory: false, status: 'Pending' },
  { id: 'doc-11', name: 'Offer Letter(s) from previous employer(s)', isMandatory: false, status: 'Pending' },
  { id: 'doc-12', name: 'Experience Letter(s) from previous employer(s)', isMandatory: false, status: 'Pending' },
  { id: 'doc-13', name: 'Relieving Letter from previous employer', isMandatory: false, status: 'Pending' },
  { id: 'doc-14', name: 'Last 3 Salary Slips', isMandatory: false, status: 'Pending' },
  { id: 'doc-15', name: 'Updated Resume', isMandatory: false, status: 'Pending' },
];

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Connected to Neon PostgreSQL Database');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Employee')),
        department VARCHAR(100) DEFAULT 'Engineering',
        designation VARCHAR(100) DEFAULT 'Team Member',
        status VARCHAR(20) DEFAULT 'Active',
        location VARCHAR(100) DEFAULT 'Delhi NCR (HQ)',
        join_date DATE DEFAULT CURRENT_DATE,
        salary NUMERIC(12, 2) DEFAULT 125000.00,
        phone VARCHAR(50) DEFAULT '+91 99997 40587',
        emergency_phone VARCHAR(50) DEFAULT '+91 98110 00000',
        address TEXT DEFAULT 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
        marital_status VARCHAR(50) DEFAULT 'Single',
        nominee_name VARCHAR(100) DEFAULT 'Parent / Spouse',
        nominee_dob VARCHAR(50) DEFAULT '1995-05-15',
        nominee_relation VARCHAR(50) DEFAULT 'Parent',
        highest_qualification VARCHAR(150) DEFAULT 'Bachelor of Technology (B.Tech)',
        medical_history TEXT DEFAULT 'No major pre-existing conditions reported.',
        score_card NUMERIC(5, 2) DEFAULT 95.00,
        manager VARCHAR(100) DEFAULT 'Admin Office',
        avatar VARCHAR(500) DEFAULT '',
        pto_balance INT DEFAULT 15,
        sick_balance INT DEFAULT 10,
        parental_balance INT DEFAULT 0,
        performance_rating NUMERIC(3, 2) DEFAULT 4.5,
        documents JSONB DEFAULT '[]'::jsonb
      );
    `);

    // Ensure columns exist if table was already created
    const alterQueries = [
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(50) DEFAULT '+91 98110 00000';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50) DEFAULT 'Single';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS nominee_name VARCHAR(100) DEFAULT 'Parent / Spouse';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS nominee_dob VARCHAR(50) DEFAULT '1995-05-15';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS nominee_relation VARCHAR(50) DEFAULT 'Parent';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS highest_qualification VARCHAR(150) DEFAULT 'Bachelor of Technology (B.Tech)';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS medical_history TEXT DEFAULT 'No major pre-existing conditions reported.';",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS score_card NUMERIC(5, 2) DEFAULT 95.00;",
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;"
    ];

    for (const q of alterQueries) {
      await client.query(q);
    }

    // Create leave_requests table
    await client.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL,
        employee_avatar VARCHAR(500) DEFAULT '',
        department VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        days INT NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending',
        requested_on DATE DEFAULT CURRENT_DATE,
        approver_note TEXT
      );
    `);

    // Create payroll table
    await client.query(`
      CREATE TABLE IF NOT EXISTS payroll (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        base_salary NUMERIC(12, 2) NOT NULL,
        bonus NUMERIC(12, 2) DEFAULT 0,
        health_deduction NUMERIC(12, 2) DEFAULT 300,
        tax_deduction NUMERIC(12, 2) DEFAULT 1500,
        net_pay NUMERIC(12, 2) NOT NULL,
        payment_status VARCHAR(20) DEFAULT 'Processing',
        pay_period VARCHAR(100) NOT NULL
      );
    `);

    // Create candidates table
    await client.query(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        stage VARCHAR(50) DEFAULT 'Sourced',
        avatar VARCHAR(500) DEFAULT '',
        email VARCHAR(150) NOT NULL,
        applied_date DATE DEFAULT CURRENT_DATE,
        tasks_completed INT DEFAULT 0,
        total_tasks INT DEFAULT 5,
        checklist JSONB DEFAULT '[]'::jsonb
      );
    `);

    // Create goals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL,
        title TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        progress INT DEFAULT 0,
        due_date DATE NOT NULL,
        rating NUMERIC(3, 2) DEFAULT 4.5,
        reviewer VARCHAR(100) DEFAULT 'HR Manager',
        feedback TEXT
      );
    `);

    // Create attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        check_in VARCHAR(50),
        check_out VARCHAR(50),
        work_hours VARCHAR(50) DEFAULT '0h 0m',
        status VARCHAR(50) DEFAULT 'Present',
        location VARCHAR(100) DEFAULT 'Delhi NCR (HQ)'
      );
    `);

    // Create helpdesk_tickets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS helpdesk_tickets (
        id VARCHAR(50) PRIMARY KEY,
        employee_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        employee_name VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Open',
        created_at DATE DEFAULT CURRENT_DATE,
        last_updated DATE DEFAULT CURRENT_DATE,
        description TEXT NOT NULL
      );
    `);

    // Create activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(50) PRIMARY KEY,
        user_name VARCHAR(100) NOT NULL,
        avatar VARCHAR(500) DEFAULT '',
        action TEXT NOT NULL,
        timestamp VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure ON UPDATE CASCADE on foreign key constraints for frictionless Emp_id updates
    try {
      await client.query(`
        ALTER TABLE leave_requests DROP CONSTRAINT IF EXISTS leave_requests_employee_id_fkey;
        ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      await client.query(`
        ALTER TABLE payroll DROP CONSTRAINT IF EXISTS payroll_employee_id_fkey;
        ALTER TABLE payroll ADD CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      await client.query(`
        ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_employee_id_fkey;
        ALTER TABLE goals ADD CONSTRAINT goals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      await client.query(`
        ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_employee_id_fkey;
        ALTER TABLE attendance ADD CONSTRAINT attendance_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      await client.query(`
        ALTER TABLE helpdesk_tickets DROP CONSTRAINT IF EXISTS helpdesk_tickets_employee_id_fkey;
        ALTER TABLE helpdesk_tickets ADD CONSTRAINT helpdesk_tickets_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
    } catch (e) {
      console.log('Foreign key ON UPDATE CASCADE applied');
    }

    // Required 5 users configuration
    const requiredUsers = [
      {
        id: 'EMP-1001',
        name: 'Sujal kumar',
        email: 'sujal.kumar@kenzoinfosystems.com',
        role: 'Employee',
        department: 'Engineering',
        designation: 'Software Engineer',
        salary: 125000,
      },
      {
        id: 'EMP-1002',
        name: 'Laxmi Narayan',
        email: 'laxminarayan.ojha@kenzoinfosystems.com',
        role: 'Employee',
        department: 'Engineering',
        designation: 'Senior Frontend Developer',
        salary: 135000,
      },
      {
        id: 'EMP-1003',
        name: 'Ankit sethi',
        email: 'Ankit.sethi@kenzoinfosystems.com',
        role: 'Admin',
        department: 'Human Resources',
        designation: 'HR Administrator & Director',
        salary: 180000,
      },
      {
        id: 'EMP-1004',
        name: 'Jitender Saini',
        email: 'Jitender.saini@kenzoinfosystems.com',
        role: 'Admin',
        department: 'Operations',
        designation: 'VP of Operations & HR Admin',
        salary: 195000,
      },
      {
        id: 'EMP-1005',
        name: 'Chanchal Saini',
        email: 'Chanchal.saini@kenzoinfosystems.com',
        role: 'Admin',
        department: 'Finance',
        designation: 'Chief Administrative Officer',
        salary: 210000,
      },
    ];

    const passwordHash = await bcrypt.hash('kenzo123', 10);

    // Clean up any old dummy users not in the 5 required list
    const allowedEmails = requiredUsers.map((u) => u.email.toLowerCase());
    await client.query(
      `DELETE FROM users WHERE LOWER(email) NOT IN (${allowedEmails.map((_, i) => `$${i + 1}`).join(',')})`,
      allowedEmails
    );

    // Upsert the 5 required users
    for (const u of requiredUsers) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0060ac&color=fff&bold=true`;
      
      const existingUser = await client.query('SELECT id, documents FROM users WHERE LOWER(email) = LOWER($1)', [u.email]);
      if (existingUser.rows.length === 0) {
        await client.query(
          `INSERT INTO users (id, name, email, password_hash, role, department, designation, salary, avatar, documents)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [u.id, u.name, u.email, passwordHash, u.role, u.department, u.designation, u.salary, avatarUrl, JSON.stringify(DEFAULT_EMPLOYEE_DOCUMENTS)]
        );
      } else {
        // Update user documents if empty
        const docCount = existingUser.rows[0].documents ? existingUser.rows[0].documents.length : 0;
        if (docCount === 0) {
          await client.query(
            `UPDATE users SET documents = $1 WHERE LOWER(email) = LOWER($2)`,
            [JSON.stringify(DEFAULT_EMPLOYEE_DOCUMENTS), u.email]
          );
        }
      }
    }

    // Seed Payroll Records if empty
    const payrollCheck = await client.query('SELECT COUNT(*) FROM payroll');
    if (parseInt(payrollCheck.rows[0].count, 10) === 0) {
      const samplePayrolls = [
        { id: 'PAY-1001-1', empId: 'EMP-1001', name: 'Sujal kumar', role: 'Software Engineer', dept: 'Engineering', base: 5208.33, bonus: 500, health: 145.83, tax: 1000, net: 4562.50, status: 'Paid', period: 'Aug 01 - Aug 15, 2026' },
        { id: 'PAY-1001-2', empId: 'EMP-1001', name: 'Sujal kumar', role: 'Software Engineer', dept: 'Engineering', base: 5208.33, bonus: 250, health: 145.83, tax: 1000, net: 4312.50, status: 'Paid', period: 'Jul 16 - Jul 31, 2026' },
        { id: 'PAY-1002-1', empId: 'EMP-1002', name: 'Laxmi Narayan', role: 'Senior Frontend Developer', dept: 'Engineering', base: 5625.00, bonus: 500, health: 150.00, tax: 1587.50, net: 4387.50, status: 'Paid', period: 'Aug 01 - Aug 15, 2026' },
        { id: 'PAY-1002-2', empId: 'EMP-1002', name: 'Laxmi Narayan', role: 'Senior Frontend Developer', dept: 'Engineering', base: 5625.00, bonus: 300, health: 150.00, tax: 1587.50, net: 4187.50, status: 'Paid', period: 'Jul 16 - Jul 31, 2026' },
        { id: 'PAY-1003-1', empId: 'EMP-1003', name: 'Ankit sethi', role: 'HR Administrator & Director', dept: 'Human Resources', base: 7500.00, bonus: 800, health: 200.00, tax: 1500.00, net: 6600.00, status: 'Paid', period: 'Aug 01 - Aug 15, 2026' },
        { id: 'PAY-1004-1', empId: 'EMP-1004', name: 'Jitender Saini', role: 'VP of Operations & HR Admin', dept: 'Operations', base: 8125.00, bonus: 1000, health: 220.00, tax: 1700.00, net: 7205.00, status: 'Paid', period: 'Aug 01 - Aug 15, 2026' },
        { id: 'PAY-1005-1', empId: 'EMP-1005', name: 'Chanchal Saini', role: 'Chief Administrative Officer', dept: 'Finance', base: 8750.00, bonus: 1200, health: 250.00, tax: 1900.00, net: 7800.00, status: 'Paid', period: 'Aug 01 - Aug 15, 2026' },
      ];

      for (const p of samplePayrolls) {
        await client.query(
          `INSERT INTO payroll (id, employee_id, employee_name, role, department, base_salary, bonus, health_deduction, tax_deduction, net_pay, payment_status, pay_period)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [p.id, p.empId, p.name, p.role, p.dept, p.base, p.bonus, p.health, p.tax, p.net, p.status, p.period]
        );
      }
    }

    // Seed Attendance Records if empty
    const attCheck = await client.query('SELECT COUNT(*) FROM attendance');
    if (parseInt(attCheck.rows[0].count, 10) === 0) {
      const sampleAttendance = [
        // Today 2026-08-13
        { id: 'ATT-1001-TODAY', empId: 'EMP-1001', name: 'Sujal kumar', date: '2026-08-13', checkIn: '09:05 AM', checkOut: '06:00 PM', workHours: '8h 55m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1002-TODAY', empId: 'EMP-1002', name: 'Laxmi Narayan', date: '2026-08-13', checkIn: '09:12 AM', checkOut: '06:15 PM', workHours: '9h 03m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1003-TODAY', empId: 'EMP-1003', name: 'Ankit sethi', date: '2026-08-13', checkIn: '10:45 AM', checkOut: '06:30 PM', workHours: '7h 45m', status: 'Late', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1004-TODAY', empId: 'EMP-1004', name: 'Jitender Saini', date: '2026-08-13', checkIn: '09:30 AM', checkOut: '06:00 PM', workHours: '8h 30m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1005-TODAY', empId: 'EMP-1005', name: 'Chanchal Saini', date: '2026-08-13', checkIn: '08:55 AM', checkOut: '05:45 PM', workHours: '8h 50m', status: 'Present', location: 'Delhi NCR (HQ)' },
        // Yesterday 2026-08-12
        { id: 'ATT-1001-YEST', empId: 'EMP-1001', name: 'Sujal kumar', date: '2026-08-12', checkIn: '09:00 AM', checkOut: '06:00 PM', workHours: '9h 00m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1002-YEST', empId: 'EMP-1002', name: 'Laxmi Narayan', date: '2026-08-12', checkIn: '09:10 AM', checkOut: '06:10 PM', workHours: '9h 00m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1003-YEST', empId: 'EMP-1003', name: 'Ankit sethi', date: '2026-08-12', checkIn: '09:15 AM', checkOut: '06:00 PM', workHours: '8h 45m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1004-YEST', empId: 'EMP-1004', name: 'Jitender Saini', date: '2026-08-12', checkIn: '09:20 AM', checkOut: '06:00 PM', workHours: '8h 40m', status: 'Present', location: 'Delhi NCR (HQ)' },
        { id: 'ATT-1005-YEST', empId: 'EMP-1005', name: 'Chanchal Saini', date: '2026-08-12', checkIn: '09:00 AM', checkOut: '06:00 PM', workHours: '9h 00m', status: 'Present', location: 'Delhi NCR (HQ)' },
      ];

      for (const a of sampleAttendance) {
        await client.query(
          `INSERT INTO attendance (id, employee_id, employee_name, date, check_in, check_out, work_hours, status, location)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [a.id, a.empId, a.name, a.date, a.checkIn, a.checkOut, a.workHours, a.status, a.location]
        );
      }
    }

    console.log('Database schema, payroll & attendance records initialized cleanly!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}
