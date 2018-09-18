export const urlLogin  = '/api/login';
export const urlLogout = '/api/logout';

/*登录接口 */
export interface ILogin {
  code: 1;
  msg: string;
  userType: string;
}

// 登录后验证信息
export interface IAuth {
  code: 1;
  userName: string;
  displayName: string;
  avatar: string;
  userType: number;
}

declare global {
  interface IService {
    /**
     * 登录
     */
    [urlLogin]: {
      params: any;
      data: {
        password: string;
        passport: string;
      };
      response: ILogin;
    };
    /**
     * 退出登录
     */
    [urlLogout]: {
      params: any;
      data: any;
      response: {
        code: 1
      } | IResponse;
    };
  }
}
