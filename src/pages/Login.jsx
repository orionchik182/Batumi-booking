import LoginForm from '../features/authentication/LoginForm';
import Logo from '../ui/Logo';

function Login() {
  return (
    <div className="grid min-h-screen grid-cols-[48rem] content-center justify-center gap-8 bg-gray-50">
      <div className="justify-self-center">
        <Logo />
      </div>
      <div className="h4">Login to your account</div>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
