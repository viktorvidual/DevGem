// @ts-nocheck
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import Login from '../../src/components/Login/Login.tsx';
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { LOG_IN_PATH } from '../../src/common/common.ts';

describe('Login component tests', () => {

  it('Renders correctly initial document', async () => {
    render(
      <Router>
        <Routes>
          <Route path={LOG_IN_PATH} element={<Login />} />
        </Routes>
        <Login />
      </Router>
    );
    const loginLabel = screen.getByText('Sign In');

    expect(loginLabel).toBeInTheDocument();
  });

  it('Displays error for wrong input', async () => {
    render(
      <Router>
        <Routes>
          <Route path={LOG_IN_PATH} element={<Login />} />
        </Routes>
        <Login />
      </Router>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 't@t.com' } });
    fireEvent.change(passwordInput, { target: { value: '555' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText('An error occurred. Please try again later.');
      expect(errorMessage).toBeInTheDocument();
    });

  });

});