import * as AuditService from '../services/audit.service.js';
import { sendPaginated } from '../utils/response.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const { logs, pagination } = await AuditService.getAuditLogs(req.query);
    return sendPaginated(res, 'Audit logs retrieved.', logs, pagination);
  } catch (err) { next(err); }
};