jest.mock('../lib/auth', () => ({
  useAuth: () => ({
    signinWithGoogle: {}
  })
}));
import { render, screen } from '@testing-library/react';

import Index from '../pages/index';

describe('Index page', () => {
  it('should render', () => {
    render(<Index />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    const googleButton = screen.getByRole('button');
    expect(googleButton).toBeInTheDocument();
    expect(googleButton).toBeEnabled();
    expect(googleButton).toHaveTextContent('Continue with Google');
  });
});
