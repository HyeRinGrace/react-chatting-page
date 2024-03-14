import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import app from '../../firebase';
import md5 from 'md5';
import { ref, set } from 'firebase/database';
import { db } from '../../firebase';

const RegisterPage = () => {
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
      const createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password);

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      });

      set(ref(db, `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL
      });
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
        <h3>Register</h3>
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
            <label>Name</label>
            <input
              type='text'
              name='name'
              className='form-control'
              {...register('name', { required: true, maxLength: 10 })}
            />
            {errors.name && errors.name.type === 'required' && <span className='error'>This name field is required</span>}
            {errors.name && errors.name.type === 'maxLength' && (
              <span className='error'>Your input exceeds the maximum length</span>
            )}
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
          <Link to={'/login'} style={{ color: 'gray', textDecoration: 'none' }}>
            <div>Already have an account?</div>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
