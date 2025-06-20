import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" className="form-control my-2" />
        <input name="email" type="email" onChange={handleChange} placeholder="Email" className="form-control my-2" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" className="form-control my-2" />
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default Register;
