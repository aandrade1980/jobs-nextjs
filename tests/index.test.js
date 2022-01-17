jest.mock('../hooks/hooks.js', () => ({
  useAuth: () => ({
    signIn: {}
  })
}));
import { fireEvent, render, screen } from '@testing-library/react';

import Index from '../pages/index';
import { MotionButton } from '../util/chakra-motion';

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

  it('calls the onClick callback handler', () => {
    const signIn = jest.fn();

    render(<MotionButton onClick={signIn}></MotionButton>);

    fireEvent.click(screen.getByRole('button'));

    expect(signIn).toHaveBeenCalledTimes(1);
  });
});
