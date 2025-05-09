// @ts-nocheck
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkout from '../../src/components/Checkout/Checkout.tsx';
import { INVALID_ADDRESS, INVALID_CITY, INVALID_COUNTRY, INVALID_FIRST_NAME, INVALID_LAST_NAME, INVALID_ZIP } from '../../src/common/common.ts';
import { Routes } from 'react-router-dom';
import { BrowserRouter as Router } from "react-router-dom";

describe('Checkout flow tests', () => {

  it('Renders correctly the OrderReview component', async () => {

    render(<Checkout />);

    const summaryLabel = screen.getByText('Selected add-on');
    expect(summaryLabel).toBeInTheDocument();
  })


  describe('Address form component', () => {

    it('Renders correctly the AddressForm component', async () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const form = screen.getAllByText('Order address');
      expect(form[0]).toBeInTheDocument();
    })


    it('Shows error when invalid first name is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: '5' } });

      fireEvent.click(button);
      const errorMessage = screen.queryByText(INVALID_FIRST_NAME);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(firstNameField, { target: { value: 569555 } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(firstNameField, { target: { value: '' } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Doesn`t show error when valid first name is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });
      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_FIRST_NAME);
      expect(errorMessage).not.toBeInTheDocument();
    })

    it('Shows error when invalid last name is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "k" } });

      fireEvent.click(button);
      const errorMessage = screen.getByText(INVALID_LAST_NAME);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(lastNameField, { target: { value: "" } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(lastNameField, { target: { value: 898955 } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Doesn`t show error when valid last name is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      fireEvent.click(button);
      const errorMessage = screen.queryByText(INVALID_LAST_NAME);
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('Shows error when invalid country is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'bg' } });

      fireEvent.click(button);

      const errorMessage = screen.getByText(INVALID_COUNTRY);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(countryField, { target: { value: '' } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Doesn`t show error when valid country is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_COUNTRY);
      expect(errorMessage).not.toBeInTheDocument();
    })


    it('Shows error when invalid address is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Short' } });
      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_ADDRESS);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.click(button);

      fireEvent.change(addressField, { target: { value: '' } });
      expect(errorMessage).toBeInTheDocument();

    })

    it('Doesn`t show error message when valid address is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Normal address line added' } });
      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_ADDRESS);
      expect(errorMessage).not.toBeInTheDocument();
    })

    it('Shows error when invalid city is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Normal address line added' } });

      const cityField = screen.getByLabelText(/city/i)
      fireEvent.change(cityField, { target: { value: 'J' } });
      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_CITY);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(cityField, { target: { value: 0 } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Doesn`t show error message when valid city is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Normal address line added' } });

      const cityField = screen.getByLabelText(/city/i)
      fireEvent.change(cityField, { target: { value: 'Sofia' } });
      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_CITY);
      expect(errorMessage).not.toBeInTheDocument();
    })

    it('Shows error when invalid zip code is submitted', () => {
      render(<Checkout />);

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Normal address line added' } });

      const cityField = screen.getByLabelText(/city/i)
      fireEvent.change(cityField, { target: { value: 'Sofia' } });

      const zipField = screen.getByLabelText(/zip/i);
      fireEvent.change(zipField, { target: { value: 'hi' } });

      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_ZIP);
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(zipField, { target: { value: 5.6 } });
      fireEvent.click(button);
      expect(errorMessage).toBeInTheDocument();
    })

    it('Doesn`t show error when valid zip is submitted', () => {
      render(
        <Router>
          <Checkout />
        </Router>
      );

      const button = screen.getByRole("button", { name: /next/i });
      fireEvent.click(button);

      const firstNameField = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameField, { target: { value: "Maria" } });

      const lastNameField = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameField, { target: { value: "Karamfilova" } });

      const countryField = screen.getByLabelText(/country/i);
      fireEvent.change(countryField, { target: { value: 'Bulgaria' } });

      const addressField = screen.getByLabelText(/address line/i);
      fireEvent.change(addressField, { target: { value: 'Normal address line added' } });

      const cityField = screen.getByLabelText(/city/i)
      fireEvent.change(cityField, { target: { value: 'Sofia' } });

      const zipField = screen.getByLabelText(/zip/i);
      fireEvent.change(zipField, { target: { value: 555 } });

      fireEvent.click(button);

      const errorMessage = screen.queryByText(INVALID_ZIP);
      expect(errorMessage).not.toBeInTheDocument();
    })
  })

  describe('Payment component', () => {
    
  })
})