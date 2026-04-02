import { Op, fn, col, literal } from 'sequelize';
import { sequelize } from '../config/database.js';
import { FinancialRecord } from '../models/index.js';

const baseWhere = (user) => {
  const where = { deleted_at: null };
  if (user.role !== 'admin') where.user_id = user.id;
  return where;
};

export const getSummary = async (user) => {
  const where = baseWhere(user);

  const [incomeResult, expenseResult] = await Promise.all([
    FinancialRecord.findOne({
      where: { ...where, type: 'income' },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    }),
    FinancialRecord.findOne({
      where: { ...where, type: 'expense' },
      attributes: [[fn('SUM', col('amount')), 'total']],
      raw: true,
    }),
  ]);

  const totalIncome = parseFloat(incomeResult?.total || 0);
  const totalExpenses = parseFloat(expenseResult?.total || 0);
  const netBalance = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, netBalance };
};

export const getCategoryTotals = async (user) => {
  const where = baseWhere(user);

  const results = await FinancialRecord.findAll({
    where,
    attributes: ['category', 'type', [fn('SUM', col('amount')), 'total']],
    group: ['category', 'type'],
    raw: true,
  });

  // Pivot into { category: { income: X, expense: Y } }
  const pivoted = {};
  for (const row of results) {
    if (!pivoted[row.category]) pivoted[row.category] = { income: 0, expense: 0 };
    pivoted[row.category][row.type] = parseFloat(row.total);
  }

  return pivoted;
};

export const getMonthlyTrends = async (user, year) => {
  const where = baseWhere(user);
  const targetYear = year || new Date().getFullYear();

  where.date = {
    [Op.between]: [`${targetYear}-01-01`, `${targetYear}-12-31`],
  };

  const results = await FinancialRecord.findAll({
    where,
    attributes: [
      [fn('TO_CHAR', col('date'), 'YYYY-MM'), 'month'],
      'type',
      [fn('SUM', col('amount')), 'total'],
    ],
    group: [literal("TO_CHAR(date, 'YYYY-MM')"), 'type'],
    order: [[literal("TO_CHAR(date, 'YYYY-MM')"), 'ASC']],
    raw: true,
  });

  // Build month map
  const monthMap = {};
  for (const row of results) {
    if (!monthMap[row.month]) monthMap[row.month] = { month: row.month, income: 0, expense: 0 };
    monthMap[row.month][row.type] = parseFloat(row.total);
  }

  return Object.values(monthMap).map((m) => ({
    ...m,
    net: m.income - m.expense,
  }));
};

export const getRecentActivity = async (user, limit = 10) => {
  const where = baseWhere(user);

  return FinancialRecord.findAll({
    where,
    limit: Math.min(50, limit),
    order: [['created_at', 'DESC']],
    attributes: ['id', 'amount', 'type', 'category', 'date', 'notes', 'created_at'],
  });
};

export const getWeeklyTrends = async (user) => {
  const where = baseWhere(user);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  where.date = { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] };

  const results = await FinancialRecord.findAll({
    where,
    attributes: [
      'date',
      'type',
      [fn('SUM', col('amount')), 'total'],
    ],
    group: ['date', 'type'],
    order: [['date', 'ASC']],
    raw: true,
  });

  const dayMap = {};
  for (const row of results) {
    if (!dayMap[row.date]) dayMap[row.date] = { date: row.date, income: 0, expense: 0 };
    dayMap[row.date][row.type] = parseFloat(row.total);
  }

  return Object.values(dayMap);
};