import { Yoks } from '@yoks/core';

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  date: Date;
}

const userStore = new Yoks<
  UserState,
  {
    setLoading: (loading: boolean) => (state: UserState) => UserState;
    setError: (error: string | null) => (state: UserState) => UserState;
    setUserInfo: (userInfo: UserInfo) => (state: UserState) => UserState;
    setUserTheme: (theme: 'light' | 'dark') => (state: UserState) => UserState;
    setDate: (date: Date) => (state: UserState) => UserState;
    logout: () => UserState;
    // 模拟异步登录
    login: (email: string, password: string) => (state: UserState) => UserState;
  }
>(
  {
    userInfo: null,
    loading: false,
    error: null,
    theme: 'light',
    date: new Date(),
  },
  {
    setLoading: (loading: boolean) => state => ({ ...state, loading }),
    setError: (error: string | null) => state => ({ ...state, error }),
    setUserInfo: (userInfo: UserInfo) => state => ({ ...state, userInfo }),
    setUserTheme: (theme: 'light' | 'dark') => state => ({ ...state, theme }),
    setDate: (date: Date) => state => ({ ...state, date }),
    logout: () => ({
      userInfo: null,
      loading: false,
      error: null,
      theme: 'light',
      date: new Date(),
    }),
    login: (email: string, password: string) => state => {
      // 这里模拟异步登录
      setTimeout(() => {
        if (email === 'test@test.com' && password === '123456') {
          userStore.actions.setUserInfo({
            id: 1,
            name: 'Test User',
            email: 'test@test.com',
          });
          userStore.actions.setLoading(false);
        } else {
          userStore.actions.setError('Invalid credentials');
          userStore.actions.setLoading(false);
        }
      }, 1000);

      return { ...state, loading: true, error: null };
    },
  },
);

export { userStore };
