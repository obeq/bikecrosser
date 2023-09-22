import { render, screen } from '@/test-utils';
import { Crossing } from './Crossing';

describe('Welcome component', () => {
  it('has correct Next.js theming section link', () => {
    render(<Crossing />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/next/'
    );
  });
});
