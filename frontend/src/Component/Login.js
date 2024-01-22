import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', { username, password })
      .then(res => {
        enqueueSnackbar('Login success', { variant: 'success' });
        const token = res.data.token;

        
        Cookies.set('jwt', token, { expires:  1 / 24 }); 

        console.log(res);
        navigate('/home');
      })
      .catch(err => {
        enqueueSnackbar('Login failed', { variant: 'error' });
        console.log(err);
      });
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className='mb-2'>
            <label htmlFor='username'>User Name</label>
            <input
              type='username'
              placeholder='Enter username'
              className='form-control'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Password'
              className='form-control'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='btn btn-primary' type='submit'>Login</button>
          &nbsp;&nbsp;&nbsp;
          <Link to="/register" className='btn btn-success'>New user</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
