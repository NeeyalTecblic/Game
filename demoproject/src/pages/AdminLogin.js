import React, { useState } from 'react';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
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
    // TODO: Call API
    setMessage('Login submitted (API call placeholder)');
  };

  return (
    <div className="form-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error">{errors.email}</div>}
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {errors.password && <div className="error">{errors.password}</div>}
        <button type="submit">Login</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default AdminLogin; 