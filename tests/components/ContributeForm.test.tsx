import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContributeForm } from '../../src/components/ContributeForm';

jest.mock('../../src/hooks/useSubmission', () => ({
  useSubmission: () => ({
    submission: { status: 'idle' },
    submit: jest.fn(),
    reset: jest.fn(),
  }),
}));

const WORKER_URL = 'https://example.com/submit';

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Dragon Fruit' } });
  fireEvent.click(screen.getByRole('radio', { name: /Standard/ }));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'vegan' } });
  fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), {
    target: { value: 'Steamed until very soft and cut into thick strips.' },
  });
  fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 9–12 month old...'), {
    target: { value: 'Cut into small bite-sized pieces of soft cooked florets.' },
  });
}

// ---------------------------------------------------------------------------
// Duplicate detection
// ---------------------------------------------------------------------------
describe('ContributeForm — duplicate detection', () => {
  it('shows a warning immediately when an existing food name is typed', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Broccoli' } });
    expect(screen.getByText(/"Broccoli" is already in the dataset\./)).toBeInTheDocument();
  });

  it('is case-insensitive', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'broccoli' } });
    expect(screen.getByText(/"Broccoli" is already in the dataset\./)).toBeInTheDocument();
  });

  it('disables the submit button on a duplicate', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Banana' } });
    expect(screen.getByRole('button', { name: /submit contribution/i })).toBeDisabled();
  });

  it('shows no warning for a new food name', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Dragon Fruit' } });
    expect(screen.queryByText(/is already in the dataset/)).not.toBeInTheDocument();
  });

  it('enables the submit button for a new food name', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Dragon Fruit' } });
    expect(screen.getByRole('button', { name: /submit contribution/i })).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Preparation field character limits & live hints
// ---------------------------------------------------------------------------
describe('ContributeForm — preparation character limits', () => {
  it('shows a required error when prep 6–9 is empty on submit', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Dragon Fruit' } });
    fireEvent.click(screen.getByRole('radio', { name: /Standard/ }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'vegan' } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getAllByText(/this field is required/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows a required error when prep 9–12 is empty on submit', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('e.g. Mango'), { target: { value: 'Dragon Fruit' } });
    fireEvent.click(screen.getByRole('radio', { name: /Standard/ }));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'vegan' } });
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), {
      target: { value: 'Steamed until very soft and cut into thick strips.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('shows a live hint as soon as the user starts typing below the minimum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), { target: { value: 'Too short.' } });
    expect(screen.getByText(/minimum 20 characters/i)).toBeInTheDocument();
  });

  it('hides the live hint once the minimum is reached', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), { target: { value: 'Steamed until very soft and cut into thick strips.' } });
    expect(screen.queryByText(/minimum 20 characters/i)).not.toBeInTheDocument();
  });

  it('shows a live hint for prep 9–12 when below the minimum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 9–12 month old...'), { target: { value: 'Too short.' } });
    expect(screen.getByText(/minimum 20 characters/i)).toBeInTheDocument();
  });

  it('shows an error when prep 6–9 is below the minimum on submit', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), { target: { value: 'Too short.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
  });

  it('shows an error when prep 6–9 exceeds the maximum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 6–9 month old...'), { target: { value: 'x'.repeat(151) } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at most 150 characters/i)).toBeInTheDocument();
  });

  it('shows an error when prep 9–12 is below the minimum on submit', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 9–12 month old...'), { target: { value: 'Too short.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
  });

  it('shows an error when prep 9–12 exceeds the maximum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText('How to safely prepare this food for a 9–12 month old...'), { target: { value: 'x'.repeat(151) } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at most 150 characters/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Optional fields character limits (choking hazard & reviewer notes)
// ---------------------------------------------------------------------------
describe('ContributeForm — optional field character limits', () => {
  it('shows an error when the choking hazard warning is below the minimum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText(/choking risks/i), { target: { value: 'Short.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at least 30 characters/i)).toBeInTheDocument();
  });

  it('shows an error when reviewer notes are below the minimum', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText(/WHO infant feeding/i), { target: { value: 'Short.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument();
  });

  it('does not error when optional fields are left empty', () => {
    render(<ContributeForm workerUrl={WORKER_URL} />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /submit contribution/i }));
    expect(screen.queryByText(/at least 30 characters/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at least 20 characters/i)).not.toBeInTheDocument();
  });
});
