import UpdateUserDataForm from '../features/authentication/UpdateUserDataForm';
import UpdatePasswordForm from '../features/authentication/UpdatePasswordForm';

function Account() {
  return (
    <>
      <h1 className="h1">Update your account</h1>

      <div className="row-ver">
        <h3 className="h3">Update user data</h3>

        <UpdateUserDataForm />
      </div>

      <div className="row-ver">
        <h3 className="h3">Update password</h3>
        <UpdatePasswordForm />
      </div>
    </>
  );
}

export default Account;
