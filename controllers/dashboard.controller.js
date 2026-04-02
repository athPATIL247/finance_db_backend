import * as DashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const data = await DashboardService.getSummary(req.user);
    return sendSuccess(res, 'Dashboard summary retrieved.', data);
  } catch (err) { next(err); }
};

export const getCategoryTotals = async (req, res, next) => {
  try {
    const data = await DashboardService.getCategoryTotals(req.user);
    return sendSuccess(res, 'Category totals retrieved.', data);
  } catch (err) { next(err); }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await DashboardService.getMonthlyTrends(req.user, req.query.year);
    return sendSuccess(res, 'Monthly trends retrieved.', data);
  } catch (err) { next(err); }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const data = await DashboardService.getRecentActivity(req.user, req.query.limit);
    return sendSuccess(res, 'Recent activity retrieved.', data);
  } catch (err) { next(err); }
};

export const getWeeklyTrends = async (req, res, next) => {
  try {
    const data = await DashboardService.getWeeklyTrends(req.user);
    return sendSuccess(res, 'Weekly trends retrieved.', data);
  } catch (err) { next(err); }
};