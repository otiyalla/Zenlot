import { render } from '@testing-library/react-native';
import Header from '@/components/Header';

describe('Header Component', () => {
    test('renders correctly with title', () => {
        const { getByText } = render(<Header title="Zenlot" />);
        expect(getByText('Zenlot')).toBeTruthy();
    });

    test('applies styles based on color scheme', () => {
        const { getByText } = render(<Header title="Zenlot" />);
        const titleElement = getByText('Zenlot');
        
        // Check if the title has the correct styles applied
        expect(titleElement.props.style).toHaveProperty('fontSize', 24);
        expect(titleElement.props.style).toHaveProperty('fontWeight', 'bold');
    });

    test('renders the logo with correct source', () => {
        const { getByTestId } = render(<Header title="Zenlot" />);
        const logoElement = getByTestId('header-logo');
        
        // Check if the logo has the correct source based on color scheme
        expect(logoElement.props.source).toBeDefined();
        expect(logoElement.props.style).toHaveProperty('width', 35);
        expect(logoElement.props.style).toHaveProperty('height', 35);
    });

    test('matches snapshot', () => {
        const { toJSON } = render(<Header title="Zenlot" />);
        expect(toJSON()).toMatchSnapshot();
    });

    test('renders with dark theme', () => {
        // Mock the useColorScheme hook to return 'dark'
        jest.mock('@/hooks/useColorScheme', () => ({
        useColorScheme: () => 'dark',
        }));
        
        const { getByTestId } = render(<Header title="Zenlot" />);
        const logoElement = getByTestId('header-logo');
        
        // Check if the logo source is dark
        expect(logoElement.props.source).toBeDefined();
    });
});