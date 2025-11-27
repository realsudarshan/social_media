import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import FollowersModal from '../FollowersModal';

describe('FollowersModal Component', () => {
    const mockUsers = [
        {
            $id: '1',
            name: 'John Doe',
            username: 'johndoe',
            imageUrl: '/test-image.jpg',
        },
        {
            $id: '2',
            name: 'Jane Smith',
            username: 'janesmith',
            imageUrl: '/test-image2.jpg',
        },
    ];

    it('does not render when isOpen is false', () => {
        const { container } = render(
            <FollowersModal
                isOpen={false}
                onClose={() => { }}
                title="Followers"
                users={mockUsers}
                isLoading={false}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders modal when isOpen is true', () => {
        render(
            <FollowersModal
                isOpen={true}
                onClose={() => { }}
                title="Followers"
                users={mockUsers}
                isLoading={false}
            />
        );
        expect(screen.getByText('Followers')).toBeInTheDocument();
    });

    it('displays user list correctly', () => {
        render(
            <FollowersModal
                isOpen={true}
                onClose={() => { }}
                title="Followers"
                users={mockUsers}
                isLoading={false}
            />
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('@johndoe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('@janesmith')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(
            <FollowersModal
                isOpen={true}
                onClose={() => { }}
                title="Followers"
                users={undefined}
                isLoading={true}
            />
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows empty state when no users', () => {
        render(
            <FollowersModal
                isOpen={true}
                onClose={() => { }}
                title="Followers"
                users={[]}
                isLoading={false}
            />
        );
        expect(screen.getByText(/No followers yet/i)).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <FollowersModal
                isOpen={true}
                onClose={onClose}
                title="Followers"
                users={mockUsers}
                isLoading={false}
            />
        );

        const closeButton = screen.getByLabelText('Close');
        await user.click(closeButton);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        const { container } = render(
            <FollowersModal
                isOpen={true}
                onClose={onClose}
                title="Followers"
                users={mockUsers}
                isLoading={false}
            />
        );

        const backdrop = container.querySelector('.bg-black\\/80');
        if (backdrop) {
            await user.click(backdrop);
            expect(onClose).toHaveBeenCalledTimes(1);
        }
    });
});
