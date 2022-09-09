type User = {
  email: string;
  username: string;
};

type AuthInfo = {
  email: string;
  accessToken: string;
};

type AuthInputs = {
  email: string;
  password: string;
};

interface LoginInput extends AuthInputs {}
interface RegisterInput extends AuthInputs {
  username: string;
}

export type { User, AuthInfo, LoginInput, RegisterInput };
