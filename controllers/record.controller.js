import * as RecordService from '../services/record.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const createRecord = async (req, res, next) => {
  try {
    const record = await RecordService.createRecord(req.body, req.user.id);
    return sendSuccess(res, 'Financial record created.', record, 201);
  } catch (err) { next(err); }
};

export const getRecords = async (req, res, next) => {
  try {
    const { records, pagination } = await RecordService.getRecords(req.query, req.user);
    return sendPaginated(res, 'Records retrieved.', records, pagination);
  } catch (err) { next(err); }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await RecordService.getRecordById(req.params.id, req.user);
    return sendSuccess(res, 'Record retrieved.', record);
  } catch (err) { next(err); }
};

export const updateRecord = async (req, res, next) => {
  try {
    const updated = await RecordService.updateRecord(req.params.id, req.body, req.user);
    return sendSuccess(res, 'Record updated.', updated);
  } catch (err) { next(err); }
};

export const deleteRecord = async (req, res, next) => {
  try {
    await RecordService.softDeleteRecord(req.params.id, req.user);
    return sendSuccess(res, 'Record deleted successfully.');
  } catch (err) { next(err); }
};