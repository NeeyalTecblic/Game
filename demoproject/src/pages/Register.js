import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Register({ role }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      const endpoint = `/api/auth/register`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setMessage(data.message || 'Registration successful!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>{role === 'admin' ? 'Admin' : 'Customer'} Registration</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
        {errors.firstName && <div className="error">{errors.firstName}</div>}
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
        {errors.lastName && <div className="error">{errors.lastName}</div>}
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error">{errors.email}</div>}
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {errors.password && <div className="error">{errors.password}</div>}
        <button type="submit">Register</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

Register.propTypes = {
  role: PropTypes.oneOf(['customer', 'admin']).isRequired,
};

export default Register; 