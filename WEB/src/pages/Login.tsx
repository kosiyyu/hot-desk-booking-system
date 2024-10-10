import { Link } from 'react-router-dom';
import { Button } from '../components/Button.tsx';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 border-2 p-10 rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:border-primary-light focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none  focus:border-primary-light focus:z-10 sm:text-sm"
                />
              </div>
            </div>
            <Link
              to="#"
              className="font-bold text-primary-light hover:text-primary-lightest text-sm"
            >
              Forgot password?
            </Link>

            <div className="flex justify-center w-full">
              <Button stretchFull={true}>Sign in</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
