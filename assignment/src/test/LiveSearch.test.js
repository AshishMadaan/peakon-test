import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LiveSearch from '../components/LiveSearch';

describe('LiveSearch', () => {
  test('should loads and displays placeholder', () => {
    render(<LiveSearch placeholder='Dummy' />);
    const inputNode = screen.getByPlaceholderText('Dummy');
    expect(inputNode).toBeInTheDocument();
  });

  test('should renders the input with the text', () => {
    render(<LiveSearch placeholder='Dummy' />);
    const dummyText = 'Hello';

    const inputElem = screen.getByPlaceholderText('Dummy');
    userEvent.type(inputElem, dummyText);
    expect(inputElem).toHaveValue(dummyText);
  });

  it('should not display option list when no interaction with input', () => {
    render(<LiveSearch />);
    expect(screen.queryAllByRole('listitem').length).toBe(0);
  });

  it('should display option list when on input click', () => {
    render(<LiveSearch />);

    const dropdownInput = screen.getByRole('combobox');

    dropdownInput.click();
    expect(screen.getAllByRole('listitem')).toBeDefined();
  });

  it('should display No Match Found if nothing matches', async () => {
    render(<LiveSearch />);

    const dropdownInput = screen.getByRole('combobox');

    dropdownInput.focus();
    userEvent.type(dropdownInput, 'abc');
    expect(screen.getByText(/No Match Found!!/i)).toBeInTheDocument();
  });

  it('should display the selected value on click of listing item', async () => {
    render(<LiveSearch />);

    const dropdownInput = screen.getByRole('combobox');
    const dropdownList = screen.getByRole('list');

    dropdownInput.focus();
    fireEvent.change(dropdownInput, { target: { value: 'Harriet Banks' } });
    fireEvent.keyDown(dropdownList, { keyCode: 40 });
    fireEvent.keyDown(dropdownList, { keyCode: 13 });

    expect(dropdownInput.value).toEqual('Harriet Banks');
  });
});
