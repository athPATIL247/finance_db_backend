import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';
import { User, FinancialRecord, AuditLog } from '../models/index.js';

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Drops and recreates tables

    console.log('Seeding database...');

    const rounds = 12;
    const hashedPassword = await bcrypt.hash('password123', rounds);

    // Users
    const [admin, analyst, viewer] = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@finance.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Analyst User',
        email: 'analyst@finance.com',
        password: hashedPassword,
        role: 'analyst',
        status: 'active',
      },
      {
        name: 'Viewer User',
        email: 'viewer@finance.com',
        password: hashedPassword,
        role: 'viewer',
        status: 'active',
      },
      {
        name: 'Atharva Patil',
        email: 'atharvaspatil247@gmail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    ]);

    // Financial records
    const categories = ['salary', 'investment', 'freelance', 'rent', 'utilities', 'food', 'transport', 'healthcare', 'entertainment', 'education'];
    const records = [];

    for (let i = 0; i < 60; i++) {
      const isIncome = i % 3 !== 0;
      const date = new Date();
      date.setDate(date.getDate() - (i * 5));
      records.push({
        user_id: i % 2 === 0 ? admin.id : analyst.id,
        amount: (Math.random() * 9000 + 100).toFixed(2),
        type: isIncome ? 'income' : 'expense',
        category: categories[i % categories.length],
        date: date.toISOString().split('T')[0],
        notes: `Seeded record #${i + 1} - ${isIncome ? 'Income' : 'Expense'}`,
      });
    }

    await FinancialRecord.bulkCreate(records);

    console.log('Seeded 4 users and 60 financial records.');
    console.log('\nTest Credentials:');
    console.log('  Admin:    admin@finance.com    / password123');
    console.log('  Analyst:  analyst@finance.com  / password123');
    console.log('  Viewer:   viewer@finance.com   / password123');
    console.log('  You:      atharvaspatil247@gmail.com / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();