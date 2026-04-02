import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { RECORD_TYPES, CATEGORIES } from '../config/constants.js';

const FinancialRecord = sequelize.define(
  'FinancialRecord',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: { min: 0.01 },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(RECORD_TYPES)),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...CATEGORIES),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'financial_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default FinancialRecord;