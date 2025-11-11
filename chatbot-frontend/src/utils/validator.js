export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

export const validateUsername = (username) => {
  return typeof username === "string" && username.length >= 3 && username.length <= 20;
};
