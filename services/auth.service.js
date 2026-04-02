import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { logAudit } from '../utils/audit.js';
import { AUDIT_ACTIONS, ROLES } from '../config/constants.js';

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already in use.'), { statusCode: 409 });

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(password, rounds);

  // Public registration defaults to viewer role for safe role-based access control.
  const user = await User.create({ name, email, password: hashedPassword, role: ROLES.VIEWER });

  await logAudit(user.id, AUDIT_ACTIONS.REGISTER, 'users', user.id, { email });

  const { accessToken, refreshToken } = generateTokens({ id: user.id, role: user.role });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email, deleted_at: null } });
  if (!user) throw Object.assign(new Error('Invalid email or password.'), { statusCode: 401 });
  if (user.status === 'inactive')
    throw Object.assign(new Error('Account is inactive. Contact admin.'), { statusCode: 403 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw Object.assign(new Error('Invalid email or password.'), { statusCode: 401 });

  await logAudit(user.id, AUDIT_ACTIONS.LOGIN, 'users', user.id, { email });

  const { accessToken, refreshToken } = generateTokens({ id: user.id, role: user.role });

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token.'), { statusCode: 401 });
  }

  const user = await User.findOne({ where: { id: decoded.id, deleted_at: null } });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 401 });

  const { accessToken, refreshToken: newRefreshToken } = generateTokens({
    id: user.id,
    role: user.role,
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const sanitizeUser = (user) => {
  const { password, ...safe } = user.toJSON();
  return safe;
};