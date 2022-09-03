type APIResponse = {
  status: "success" | "error" | "fail";
  message: string;
  data: any;
};

type AccessTokenPayload = {
  email: string;
};

export { APIResponse, AccessTokenPayload };
