import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import models
import User from './models/User.js';
import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import Hazard from './models/Hazard.js';
import Equipment from './models/Equipment.js';
import Notification from './models/Notification.js';
import connectDB from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON files
const dataPath = join(__dirname, '../my-react-app/src/data');

const usersData = JSON.parse(readFileSync(join(dataPath, 'users.json'), 'utf-8'));
const employeesData = JSON.parse(readFileSync(join(dataPath, 'employees.json'), 'utf-8'));
const attendanceData = JSON.parse(readFileSync(join(dataPath, 'attendance.json'), 'utf-8'));
const hazardsData = JSON.parse(readFileSync(join(dataPath, 'hazards.json'), 'utf-8'));
const equipmentData = JSON.parse(readFileSync(join(dataPath, 'equipment.json'), 'utf-8'));
const notificationsData = JSON.parse(readFileSync(join(dataPath, 'notifications.json'), 'utf-8'));

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Attendance.deleteMany({});
    await Hazard.deleteMany({});
    await Equipment.deleteMany({});
    await Notification.deleteMany({});
    console.log('Existing data cleared.');

    console.log('Seeding users...');
    await User.insertMany(usersData.users);
    console.log(`${usersData.users.length} users seeded.`);

    console.log('Seeding employees...');
    // Transform employee data to match schema
    const transformedEmployees = employeesData.employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      department: emp.department,
      shift: emp.shift,
      role: emp.role,
      experience: emp.experienceYears || emp.experience || 0,
      contact: emp.phone || emp.contact || 'N/A',
      emergencyContact: emp.emergencyContact || 'N/A'
    }));
    await Employee.insertMany(transformedEmployees);
    console.log(`${transformedEmployees.length} employees seeded.`);

    console.log('Seeding attendance...');
    // Filter out invalid attendance records
    const validAttendance = attendanceData.attendance.filter(record => {
      return record.status !== 'No Data' && record.status;
    });
    await Attendance.insertMany(validAttendance);
    console.log(`${validAttendance.length} attendance records seeded.`);

    console.log('Seeding hazards...');
    // Transform hazard data to match schema
    const transformedHazards = hazardsData.hazards.map(hazard => ({
      id: hazard.id,
      title: hazard.type,
      description: hazard.description,
      location: hazard.location,
      severity: hazard.severity,
      status: hazard.status === 'In-progress' ? 'In Progress' : hazard.status,
      reportedBy: hazard.reportedByName || hazard.reportedBy,
      reportedDate: hazard.timestamp,
      assignedTo: hazard.assignedTo || null,
      resolvedDate: hazard.resolvedAt || null,
      image: hazard.images && hazard.images.length > 0 ? hazard.images[0] : null
    }));
    await Hazard.insertMany(transformedHazards);
    console.log(`${transformedHazards.length} hazards seeded.`);

    console.log('Seeding equipment...');
    await Equipment.insertMany(equipmentData.equipment);
    console.log(`${equipmentData.equipment.length} equipment records seeded.`);

    console.log('Seeding notifications...');
    // Transform notification data to match schema
    const transformedNotifications = notificationsData.notifications.map(notif => ({
      id: notif.id,
      type: notif.type === 'alert' ? 'Hazard' : notif.type === 'maintenance' ? 'Maintenance' : 'System',
      priority: notif.priority.charAt(0).toUpperCase() + notif.priority.slice(1),
      title: notif.title,
      message: notif.message,
      targetRole: notif.targetRole === 'all' ? 'All' : notif.targetRole.charAt(0).toUpperCase() + notif.targetRole.slice(1),
      isRead: notif.isRead,
      createdAt: notif.timestamp
    }));
    await Notification.insertMany(transformedNotifications);
    console.log(`${transformedNotifications.length} notifications seeded.`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
