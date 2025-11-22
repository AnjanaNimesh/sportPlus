export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): string | null => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters';
  }
  if (username.length > 20) {
    return 'Username must be less than 20 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (password.length > 50) {
    return 'Password must be less than 50 characters';
  }
  return null;
};

export const validateLoginForm = (username: string, password: string): ValidationResult => {
  const errors: { [key: string]: string } = {};
  
  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (
  username: string, 
  password: string, 
  confirmPassword: string
): ValidationResult => {
  const errors: { [key: string]: string } = {};
  
  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
