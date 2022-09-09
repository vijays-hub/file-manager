const emailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export { emailRegEx, passwordRegex };
