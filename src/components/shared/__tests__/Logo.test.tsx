import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import Logo from '../Logo';

describe('Logo Component', () => {
    it('renders logo image', () => {
        render(<Logo />);
        const logo = screen.getByRole('img');
        expect(logo).toBeInTheDocument();
    });

    it('renders with default size (medium)', () => {
        const { container } = render(<Logo />);
        const logo = container.querySelector('img');
        expect(logo).toHaveClass('h-10');
    });

    it('renders with large size', () => {
        const { container } = render(<Logo size="large" />);
        const logo = container.querySelector('img');
        expect(logo).toHaveClass('h-14');
    });

    it('renders with small size', () => {
        const { container } = render(<Logo size="small" />);
        const logo = container.querySelector('img');
        expect(logo).toHaveClass('h-8');
    });
});
