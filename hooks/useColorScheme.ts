import { useColorScheme as useRNColorScheme, ColorSchemeName } from 'react-native';
import { useUser } from '@/providers/UserProvider';

export const useColorScheme: () => ColorSchemeName = () => {
    const systemTheme = useRNColorScheme();
    const { user } = useUser();
    const theme = user?.theme || 'system';
    if (theme === 'dark') return 'dark' as ColorSchemeName;
    if (theme === 'light') return 'light' as ColorSchemeName;
    else return systemTheme as ColorSchemeName;
}