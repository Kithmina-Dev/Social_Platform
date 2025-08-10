// Composable for form validation utilities
export const useValidation = () => {
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate password strength
   * At least 8 chars, 1 number, 1 lowercase, 1 uppercase
   */
  const isStrongPassword = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password)
    );
  };

  // Get password strength feedback message
  const getPasswordStrengthFeedback = (password: string): string => {
    if (!password) return "";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[0-9]/.test(password)) return "Password must include a number";
    if (!/[a-z]/.test(password))
      return "Password must include a lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must include an uppercase letter";
    return "Password strength: Good";
  };

  // Validate username format (alphanumeric, underscores, 3-20 chars)
  const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Check if a URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Sanitize text input for safety
  const sanitizeInput = (input: string): string => {
    // replace HTML chars with entities
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Validate required fields
  const validateRequired = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    return true;
  };

  // Check if value has minimum length
  const hasMinLength = (value: string, length: number): boolean => {
    return !!value && value.length >= length;
  };

  // Check if value exceeds maximum length
  const hasMaxLength = (value: string, length: number): boolean => {
    return !!value && value.length <= length;
  };

  return {
    isValidEmail,
    isStrongPassword,
    getPasswordStrengthFeedback,
    isValidUsername,
    isValidUrl,
    sanitizeInput,
    validateRequired,
    hasMinLength,
    hasMaxLength,
  };
};
