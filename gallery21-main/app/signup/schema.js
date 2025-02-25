import * as yup from 'yup';

// Function to determine password strength
const passwordStrength = (password) => {
  const lengthCriteria = password.length >= 8; // Minimum length
  const lowercaseCriteria = /[a-z]/.test(password); // At least one lowercase letter
  const uppercaseCriteria = /[A-Z]/.test(password); // At least one uppercase letter
  const numberCriteria = /[0-9]/.test(password); // At least one number
  const specialCharacterCriteria = /[!@#$%^&*]/.test(password); // At least one special character
  
  // Categorize based on criteria
  const criteriaMet = [
    lengthCriteria,
    lowercaseCriteria,
    uppercaseCriteria,
    numberCriteria,
    specialCharacterCriteria,
  ].filter(Boolean).length;

  if (criteriaMet >= 4) return 'strong'; // Strong: meets at least 4 criteria
  if (criteriaMet === 3) return 'moderate'; // Moderate: meets 3 criteria
  return 'weak'; // Weak: meets less than 3 criteria
};

// Schema for signup form validation
export const signupSchema = yup.object({
  username: yup.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must not exceed 20 characters')
    .matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/, 'Username must contain at least one letter and no special characters')
    .required('Username is required'),
  email: yup.string()
    .email('Invalid email format')
    .max(50, 'Email must not exceed 50 characters')
    .required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .test('password-strength', 'Password must be at least 8 characters long, contain one letter, one number, and one special character for moderate strength', function(value) {
      if (!value) return false; // No value provided

      const strength = passwordStrength(value);
      return strength === 'moderate' || strength === 'strong'; // Accept moderate and strong
    }),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
}).required();
