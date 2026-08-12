import express from 'express';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { pool, initDb, DEFAULT_EMPLOYEE_DOCUMENTS } from './src/db/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Database on server start
initDb().catch((err) => {
  console.error('Failed to initialize database on startup:', err);
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper: map DB user row to user profile object
function mapUserRow(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    designation: user.designation || user.role,
    status: user.status,
    location: user.location,
    joinDate: user.join_date,
    salary: parseFloat(user.salary),
    phone: user.phone || '+91 99997 40587',
    emergencyPhone: user.emergency_phone || '+91 98110 00000',
    address: user.address || 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
    maritalStatus: user.marital_status || 'Single',
    nomineeName: user.nominee_name || 'Parent / Spouse',
    nomineeDob: user.nominee_dob || '1995-05-15',
    nomineeRelation: user.nominee_relation || 'Parent',
    highestQualification: user.highest_qualification || 'Bachelor of Technology (B.Tech)',
    medicalHistory: user.medical_history || 'No major pre-existing conditions reported.',
    scoreCard: parseFloat(user.score_card || 95),
    manager: user.manager,
    avatar: user.avatar,
    leaveBalance: {
      pto: user.pto_balance,
      sick: user.sick_balance,
      parental: user.parental_balance,
    },
    performanceRating: parseFloat(user.performance_rating),
    documents: user.documents && user.documents.length > 0 ? user.documents : DEFAULT_EMPLOYEE_DOCUMENTS,
  };
}

// ----------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const result = await pool.query(query, [email.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      message: 'Login successful',
      user: mapUserRow(user),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error?.message || 'Authentication error' });
  }
});

// ----------------------------------------------------
// EMPLOYEES ENDPOINTS
// ----------------------------------------------------

app.get('/api/employees', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY join_date DESC, name ASC');
    const employees = result.rows.map(mapUserRow);
    res.json(employees);
  } catch (error: any) {
    console.error('Fetch employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { 
      empId, name, email, role, department, status, location, salary, joinDate, phone, emergencyPhone,
      address, maritalStatus, nomineeName, nomineeDob, nomineeRelation, highestQualification,
      medicalHistory, scoreCard, manager, userRole 
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const defaultPasswordHash = await bcrypt.hash('kenzo123', 10);
    const newId = empId && empId.trim() ? empId.trim() : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0060ac&color=fff&bold=true`;
    const sysRole = userRole === 'Admin' ? 'Admin' : 'Employee';
    const finalJoinDate = joinDate || new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO users (
        id, name, email, password_hash, role, department, designation, status, location, salary, join_date, phone,
        emergency_phone, address, marital_status, nominee_name, nominee_dob, nominee_relation,
        highest_qualification, medical_history, score_card, manager, avatar, documents
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
      [
        newId, name, email, defaultPasswordHash, sysRole, department || 'Engineering', role || 'Software Engineer',
        status || 'Active', location || 'Delhi NCR (HQ)', salary || 125000, finalJoinDate, phone || '+91 99997 40587',
        emergencyPhone || '+91 98110 00000', address || 'Kenzo - 32-C, UNIT NO. 107, B.R. COMPLEX, MAYUR VIHAR PHASE I, EAST DELHI - 110091',
        maritalStatus || 'Single', nomineeName || 'Parent / Spouse', nomineeDob || '1995-05-15', nomineeRelation || 'Parent',
        highestQualification || 'Bachelor of Technology (B.Tech)', medicalHistory || 'No major pre-existing conditions reported.',
        scoreCard || 95.00, manager || 'Admin Office', avatarUrl, JSON.stringify(DEFAULT_EMPLOYEE_DOCUMENTS)
      ]
    );

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [newId]);
    res.status(201).json(mapUserRow(result.rows[0]));
  } catch (error: any) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee profile' });
  }
});

// Update Employee Profile (Admin or Employee editing self)
app.put('/api/employees/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      newEmpId, name, phone, emergencyPhone, address, maritalStatus, nomineeName, nomineeDob,
      nomineeRelation, highestQualification, medicalHistory, scoreCard, salary, department, designation, role,
      location, joinDate, newPassword 
    } = req.body;

    const finalRole = designation || role;
    const targetId = id;

    // Check if new password is requested
    let passwordHashToSet = null;
    if (newPassword && newPassword.trim().length > 0) {
      passwordHashToSet = await bcrypt.hash(newPassword.trim(), 10);
    }

    await pool.query(
      `UPDATE users SET 
        id = COALESCE($1, id),
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        emergency_phone = COALESCE($4, emergency_phone),
        address = COALESCE($5, address),
        marital_status = COALESCE($6, marital_status),
        nominee_name = COALESCE($7, nominee_name),
        nominee_dob = COALESCE($8, nominee_dob),
        nominee_relation = COALESCE($9, nominee_relation),
        highest_qualification = COALESCE($10, highest_qualification),
        medical_history = COALESCE($11, medical_history),
        score_card = COALESCE($12, score_card),
        salary = COALESCE($13, salary),
        department = COALESCE($14, department),
        designation = COALESCE($15, designation),
        location = COALESCE($16, location),
        join_date = COALESCE($17, join_date),
        password_hash = CASE WHEN $18::text IS NOT NULL THEN $18::text ELSE password_hash END
       WHERE id = $19`,
      [
        newEmpId || targetId, name, phone, emergencyPhone, address, maritalStatus, nomineeName, nomineeDob,
        nomineeRelation, highestQualification, medicalHistory, scoreCard, salary, department, finalRole,
        location, joinDate, passwordHashToSet, targetId
      ]
    );

    const checkId = newEmpId || targetId;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [checkId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(mapUserRow(result.rows[0]));
  } catch (error: any) {
    console.error('Update employee profile error:', error);
    res.status(500).json({ error: 'Failed to update employee profile' });
  }
});

// Update Employee Document Status / Uploads
app.put('/api/employees/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { documents } = req.body;

    await pool.query(
      'UPDATE users SET documents = $1 WHERE id = $2',
      [JSON.stringify(documents), id]
    );

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.json(mapUserRow(result.rows[0]));
  } catch (error: any) {
    console.error('Update employee documents error:', error);
    res.status(500).json({ error: 'Failed to update documents' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Employee deleted successfully', id });
  } catch (error: any) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// ----------------------------------------------------
// LEAVE REQUESTS ENDPOINTS
// ----------------------------------------------------

app.get('/api/leaves', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leave_requests ORDER BY requested_on DESC');
    const leaves = result.rows.map((r) => ({
      id: r.id,
      employeeId: r.employee_id,
      employeeName: r.employee_name,
      employeeAvatar: r.employee_avatar,
      department: r.department,
      type: r.type,
      startDate: r.start_date,
      endDate: r.end_date,
      days: r.days,
      reason: r.reason,
      status: r.status,
      requestedOn: r.requested_on,
      approverNote: r.approver_note,
    }));
    res.json(leaves);
  } catch (error: any) {
    console.error('Fetch leaves error:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, employeeName, employeeAvatar, department, type, startDate, endDate, days, reason } = req.body;
    const newId = `LR-${Date.now()}`;
    await pool.query(
      `INSERT INTO leave_requests (id, employee_id, employee_name, employee_avatar, department, type, start_date, end_date, days, reason, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [newId, employeeId, employeeName, employeeAvatar || '', department, type, startDate, endDate, days, reason, 'Pending']
    );
    res.status(201).json({
      id: newId,
      employeeId,
      employeeName,
      employeeAvatar: employeeAvatar || '',
      department,
      type,
      startDate,
      endDate,
      days,
      reason,
      status: 'Pending',
      requestedOn: new Date().toISOString().split('T')[0],
    });
  } catch (error: any) {
    console.error('Create leave error:', error);
    res.status(500).json({ error: 'Failed to submit leave request' });
  }
});

app.put('/api/leaves/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approverNote } = req.body;
    await pool.query(
      'UPDATE leave_requests SET status = $1, approver_note = $2 WHERE id = $3',
      [status, approverNote || `Updated status to ${status}`, id]
    );
    res.json({ message: 'Leave status updated', id, status });
  } catch (error: any) {
    console.error('Update leave error:', error);
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

// ----------------------------------------------------
// PAYROLL ENDPOINTS
// ----------------------------------------------------

app.get('/api/payroll', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payroll ORDER BY employee_name ASC');
    const records = result.rows.map((r) => ({
      id: r.id,
      employeeId: r.employee_id,
      employeeName: r.employee_name,
      role: r.role,
      department: r.department,
      baseSalary: parseFloat(r.base_salary),
      bonus: parseFloat(r.bonus),
      healthDeduction: parseFloat(r.health_deduction),
      taxDeduction: parseFloat(r.tax_deduction),
      netPay: parseFloat(r.net_pay),
      paymentStatus: r.payment_status,
      payPeriod: r.pay_period,
    }));
    res.json(records);
  } catch (error: any) {
    console.error('Fetch payroll error:', error);
    res.status(500).json({ error: 'Failed to fetch payroll records' });
  }
});

app.put('/api/payroll/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    await pool.query('UPDATE payroll SET payment_status = $1 WHERE id = $2', [paymentStatus, id]);
    res.json({ message: 'Payroll status updated', id, paymentStatus });
  } catch (error: any) {
    console.error('Update payroll error:', error);
    res.status(500).json({ error: 'Failed to update payroll record' });
  }
});

app.post('/api/payroll/batch', async (_req, res) => {
  try {
    await pool.query("UPDATE payroll SET payment_status = 'Paid'");
    res.json({ message: 'Batch payroll disbursed successfully' });
  } catch (error: any) {
    console.error('Batch payroll error:', error);
    res.status(500).json({ error: 'Failed to run payroll batch' });
  }
});

// ----------------------------------------------------
// CANDIDATES / ONBOARDING ENDPOINTS
// ----------------------------------------------------

app.get('/api/candidates', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates ORDER BY applied_date DESC');
    const candidates = result.rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      department: r.department,
      stage: r.stage,
      avatar: r.avatar,
      email: r.email,
      appliedDate: r.applied_date,
      tasksCompleted: r.tasks_completed,
      totalTasks: r.total_tasks,
      checklist: r.checklist || [],
    }));
    res.json(candidates);
  } catch (error: any) {
    console.error('Fetch candidates error:', error);
    res.status(500).json({ error: 'Failed to fetch onboarding candidates' });
  }
});

app.post('/api/candidates', async (req, res) => {
  try {
    const { name, role, department, email, stage } = req.body;
    const newId = `CAN-${Date.now()}`;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=48bbbe&color=fff&bold=true`;
    const defaultChecklist = [
      { id: 'c1', title: 'Background Screening', completed: false },
      { id: 'c2', title: 'Identity Verification', completed: false },
      { id: 'c3', title: 'IT Hardware Procurement', completed: false },
      { id: 'c4', title: 'Benefits Enrollment', completed: false },
      { id: 'c5', title: 'Team Orientation Schedule', completed: false },
    ];
    await pool.query(
      `INSERT INTO candidates (id, name, role, department, stage, avatar, email, tasks_completed, total_tasks, checklist)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [newId, name, role, department, stage || 'Sourced', avatarUrl, email, 0, 5, JSON.stringify(defaultChecklist)]
    );
    res.status(201).json({
      id: newId,
      name,
      role,
      department,
      stage: stage || 'Sourced',
      avatar: avatarUrl,
      email,
      appliedDate: new Date().toISOString().split('T')[0],
      tasksCompleted: 0,
      totalTasks: 5,
      checklist: defaultChecklist,
    });
  } catch (error: any) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: 'Failed to create onboarding candidate' });
  }
});

app.put('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, tasksCompleted, checklist } = req.body;
    await pool.query(
      'UPDATE candidates SET stage = COALESCE($1, stage), tasks_completed = COALESCE($2, tasks_completed), checklist = COALESCE($3, checklist) WHERE id = $4',
      [stage, tasksCompleted, checklist ? JSON.stringify(checklist) : null, id]
    );
    res.json({ message: 'Candidate updated', id });
  } catch (error: any) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

// ----------------------------------------------------
// PERFORMANCE GOALS ENDPOINTS
// ----------------------------------------------------

app.get('/api/goals', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM goals ORDER BY due_date ASC');
    const goals = result.rows.map((r) => ({
      id: r.id,
      employeeId: r.employee_id,
      employeeName: r.employee_name,
      title: r.title,
      category: r.category,
      progress: r.progress,
      dueDate: r.due_date,
      rating: parseFloat(r.rating),
      reviewer: r.reviewer,
      feedback: r.feedback,
    }));
    res.json(goals);
  } catch (error: any) {
    console.error('Fetch goals error:', error);
    res.status(500).json({ error: 'Failed to fetch performance goals' });
  }
});

app.post('/api/goals', async (req, res) => {
  try {
    const { employeeId, employeeName, title, category, dueDate, reviewer } = req.body;
    const newId = `G-${Date.now()}`;
    await pool.query(
      `INSERT INTO goals (id, employee_id, employee_name, title, category, progress, due_date, rating, reviewer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [newId, employeeId, employeeName, title, category, 0, dueDate, 4.5, reviewer || 'HR Manager']
    );
    res.status(201).json({
      id: newId,
      employeeId,
      employeeName,
      title,
      category,
      progress: 0,
      dueDate,
      rating: 4.5,
      reviewer: reviewer || 'HR Manager',
    });
  } catch (error: any) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

app.put('/api/goals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    await pool.query('UPDATE goals SET progress = $1 WHERE id = $2', [progress, id]);
    res.json({ message: 'Goal progress updated', id, progress });
  } catch (error: any) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// ----------------------------------------------------
// ACTIVITIES ENDPOINTS
// ----------------------------------------------------

app.get('/api/activities', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY created_at DESC LIMIT 20');
    const activities = result.rows.map((r) => ({
      id: r.id,
      user: r.user_name,
      avatar: r.avatar,
      action: r.action,
      timestamp: r.timestamp,
      category: r.category,
    }));
    res.json(activities);
  } catch (error: any) {
    console.error('Fetch activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// ----------------------------------------------------
// HELPDESK TICKETS ENDPOINTS (PostgreSQL Persisted)
// ----------------------------------------------------

app.get('/api/helpdesk', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM helpdesk_tickets ORDER BY created_at DESC');
    const tickets = result.rows.map((r) => ({
      id: r.id,
      employeeId: r.employee_id,
      employeeName: r.employee_name,
      subject: r.subject,
      category: r.category,
      priority: r.priority,
      status: r.status,
      createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      lastUpdated: r.last_updated ? new Date(r.last_updated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: r.description,
    }));
    res.json(tickets);
  } catch (error: any) {
    console.error('Fetch helpdesk tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch helpdesk tickets' });
  }
});

app.post('/api/helpdesk', async (req, res) => {
  try {
    const { employeeId, employeeName, subject, category, priority, description } = req.body;
    const newId = `TCK-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO helpdesk_tickets (id, employee_id, employee_name, subject, category, priority, status, created_at, last_updated, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [newId, employeeId, employeeName, subject, category, priority || 'Medium', 'Open', today, today, description]
    );

    res.status(201).json({
      id: newId,
      employeeId,
      employeeName,
      subject,
      category,
      priority: priority || 'Medium',
      status: 'Open',
      createdAt: today,
      lastUpdated: today,
      description,
    });
  } catch (error: any) {
    console.error('Create helpdesk ticket error:', error);
    res.status(500).json({ error: 'Failed to create helpdesk ticket' });
  }
});

app.put('/api/helpdesk/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      'UPDATE helpdesk_tickets SET status = $1, last_updated = $2 WHERE id = $3',
      [status, today, id]
    );

    res.json({ message: 'Helpdesk ticket status updated', id, status, lastUpdated: today });
  } catch (error: any) {
    console.error('Update helpdesk ticket error:', error);
    res.status(500).json({ error: 'Failed to update helpdesk ticket status' });
  }
});

// ----------------------------------------------------
// AI HR ASSISTANT ENDPOINT
// ----------------------------------------------------

app.post('/api/ai-chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        response: `[HR Assistant Advisory]: API Key is not currently configured in runtime secrets. However, based on standard Enterprise Modern guidelines:
• For onboarding questions: Employees should complete 100% of standard compliance documents within their first 14 days.
• For leave policies: Paid Time Off (PTO) requires a minimum 3 days advance notice for non-emergencies.
• For payroll inquiries: Pay cycles run bi-weekly on alternate Fridays.`
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are an executive HR AI Consultant embedded in the Kenzo_Kore_HRMS platform.
You assist HR administrators and team managers with:
1. Drafting professional employee announcements, job descriptions, and onboarding welcome messages.
2. Answering HR compliance, parental leave, PTO, and performance management policy questions.
3. Providing workforce analytics recommendations and retention strategies.
Keep responses concise, executive, well-structured with clear bullet points, formatted in plain text or simple markdown. Avoid fluff.`;

    const fullPrompt = context
      ? `Context details: ${JSON.stringify(context)}\n\nUser request: ${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error('Error in /api/ai-chat:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate AI response' });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER & PRODUCTION STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kenzo_Kore_HRMS Server running at http://localhost:${PORT}`);
  });
}

startServer();
