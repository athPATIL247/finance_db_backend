import User from './User.model.js';
import FinancialRecord from './FinancialRecord.model.js';
import AuditLog from './AuditLog.model.js';

// ── Associations ──────────────────────────────────────────────────────────────
User.hasMany(FinancialRecord, { foreignKey: 'user_id', as: 'records' });
FinancialRecord.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });

User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'actor' });

export { User, FinancialRecord, AuditLog };