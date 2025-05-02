import React, { useState } from 'react';

function EmailVerification() {
  const [form, setForm] = useState({ email: '', code: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.code) errs.code = 'Verification code is required';
    else if (!/^[0-9]{6}$/.test(form.code)) errs.code = 'Code must be 6 digits';
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
    setMessage('Verification submitted (API call placeholder)');
  };

  return (
    <div className="form-container">
      <h2>Email Verification</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error">{errors.email}</div>}
        <input name="code" placeholder="Verification Code" value={form.code} onChange={handleChange} />
        {errors.code && <div className="error">{errors.code}</div>}
        <button type="submit">Verify</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default EmailVerification; 