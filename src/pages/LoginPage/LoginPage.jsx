import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../../firebase';

const LoginPage = () => {
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [errorFromSubmit, setErrorFromSubmit] = useState('');

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email,data.password); //로그인 부분

    } catch (error) {
      console.error(error);
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  return (
<div className='auth-wrapper'>
      <div className='auth-inner'>
        <h3>Login</h3>
        <form className='FormLogin' onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label>Email</label>
            <input
              name='email'
              type='email'
              className='form-control'
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <span className='error'>This email field is required.</span>}
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              className='form-control'
              {...register('password', { required: true, minLength: 6 })}
            />
            {errors.password && errors.password.type == 'required' && (
              <span className='error'>Your password field is required</span>
            )}
            {errors.password && errors.password.type == 'minLength' && (
              <span className='error'>Password must have at least 6 characters</span>
            )}
            {errorFromSubmit && <p className='error'>{errorFromSubmit}</p>}
          </div>
          <button type='submit' className='btn btn-primary' disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
          <Link to={'/register'} style={{ color: 'gray', textDecoration: 'none' }}>
            회원가입
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage
