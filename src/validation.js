// src/validation.js
// Validation utilities for input sanitization and error handling

/**
 * Validates that a brainId is provided
 * @param {string} brainId - The brain ID to validate
 * @throws {Error} If brainId is missing or invalid
 */
export function requireBrainId(brainId) {
  if (!brainId || typeof brainId !== 'string' || brainId.trim() === '') {
    throw new Error('Brain ID is required. Use set_active_brain first or provide brainId.');
  }
}

/**
 * Validates a URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid
 * @throws {Error} If URL is invalid
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }

  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`Invalid URL protocol: ${parsed.protocol}. Only http:// and https:// are allowed.`);
    }
    return true;
  } catch (error) {
    if (error.message.includes('Invalid URL')) {
      throw new Error(`Invalid URL format: ${url}`);
    }
    throw error;
  }
}

/**
 * Validates a hex color format (#RRGGBB)
 * @param {string} color - The color to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {boolean} True if valid
 * @throws {Error} If color is invalid
 */
export function validateColor(color, fieldName = 'color') {
  if (!color) {
    return true; // Optional field
  }

  if (typeof color !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
  if (!hexColorRegex.test(color)) {
    throw new Error(`${fieldName} must be in hex format (#RRGGBB), got: ${color}`);
  }

  return true;
}

/**
 * Validates and sanitizes a file path to prevent path traversal attacks
 * @param {string} filePath - The file path to validate
 * @returns {string} The validated path
 * @throws {Error} If path contains suspicious patterns
 */
export function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path is required and must be a string');
  }

  // Check for path traversal attempts
  const normalized = filePath.replace(/\\/g, '/'); // Normalize Windows paths

  if (normalized.includes('../') || normalized.includes('..\\')) {
    throw new Error('File path contains path traversal sequence (../) which is not allowed');
  }

  // Check for absolute path attempts to sensitive directories (Unix)
  const sensitivePaths = ['/etc/', '/sys/', '/proc/', '/root/'];
  for (const sensitivePath of sensitivePaths) {
    if (normalized.startsWith(sensitivePath)) {
      throw new Error(`Access to system directory ${sensitivePath} is not allowed`);
    }
  }

  return filePath;
}

/**
 * Validates thickness value for links
 * @param {number} thickness - The thickness value
 * @returns {boolean} True if valid
 * @throws {Error} If thickness is invalid
 */
export function validateThickness(thickness) {
  if (thickness === undefined || thickness === null) {
    return true; // Optional field
  }

  if (typeof thickness !== 'number' || !Number.isFinite(thickness)) {
    throw new Error('Thickness must be a finite number');
  }

  if (thickness < 1 || thickness > 10) {
    throw new Error('Thickness must be between 1 and 10');
  }

  return true;
}

/**
 * Creates a standardized error response
 * @param {Error} error - The error object
 * @param {string} context - Additional context about where the error occurred
 * @returns {Object} Standardized error response
 */
export function createErrorResponse(error, context = '') {
  const response = {
    success: false,
    error: error.message,
  };

  // Add context if provided
  if (context) {
    response.context = context;
  }

  // In development, include stack trace
  if (process.env.NODE_ENV === 'development' || process.env.VERBOSE === 'true') {
    response.stack = error.stack;
    if (error.cause) {
      response.cause = error.cause;
    }
  }

  return response;
}
