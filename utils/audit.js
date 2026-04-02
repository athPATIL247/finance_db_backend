import { AuditLog } from '../models/index.js';

/**
 * Creates an audit log entry.
 * @param {string} userId - Who performed the action (null for system)
 * @param {string} action - CREATE | UPDATE | DELETE | LOGIN | REGISTER
 * @param {string} entity - users | financial_records
 * @param {string} entityId - UUID of the affected record
 * @param {object} metadata - Additional context (old values, new values, etc.)
 */
export const logAudit = async (userId, action, entity, entityId = null, metadata = {}) => {
  try {
    await AuditLog.create({ user_id: userId, action, entity, entity_id: entityId, metadata });
  } catch (err) {
    // Audit failures should never crash the main request
    console.error('[AUDIT LOG ERROR]', err.message);
  }
};