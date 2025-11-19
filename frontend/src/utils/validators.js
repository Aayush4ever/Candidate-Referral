export function validatePhone10(phone) {
  if (!phone) return "Phone is required";
  // Remove spaces and dashes
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return "Phone number must be exactly 10 digits";
  return null;
}

export function validateEmail(email) {
  if (!email) return "Email is required";
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  if (!re.test(email)) return "Invalid email";
  return null;
}
