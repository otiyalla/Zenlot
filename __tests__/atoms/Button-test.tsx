import { render, screen, fireEvent } from '@testing-library/react-native';
import { ButtonComponent } from '@/components/atoms/Button';

describe('ButtonComponent', () => {
    it('renders correctly with default props', () => {
        const { toJSON } = render(<ButtonComponent title="Click Me" />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders with custom styles', () => {
        const defaultTW = {color: "#007AFF", fontSize: 18, margin: 8, textAlign: "center"};
        render(<ButtonComponent title="Custom Button"  />);
        const button = screen.getByText('Custom Button');
        expect(button.props.style).toContainEqual(defaultTW);
    });

    it('calls onPress when pressed', () => {
        const mockOnPress = jest.fn().mockImplementation(() => console.log("Test Button pressed"));
        render(<ButtonComponent title="Press Me" onPress={mockOnPress} />);
        const button = screen.getByText('Press Me');
        fireEvent.press(button);
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('displays the correct title', () => {
        render(<ButtonComponent title="Test Button" />);
        expect(screen.getByText('Test Button')).toBeTruthy();
    });

    it('has accessibility label', () => {
        render(<ButtonComponent title="Accessible Button" />);
        const button = screen.getByLabelText('Accessible Button');
        expect(button).toBeTruthy();
    });

    it('matches snapshot with custom title', () => {
        const { toJSON } = render(<ButtonComponent title="Snapshot Button" />);
        expect(toJSON()).toMatchSnapshot();
    }
  );
});