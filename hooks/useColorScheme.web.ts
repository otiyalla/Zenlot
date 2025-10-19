import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme, ColorSchemeName } from 'react-native';
import { useUser } from '@/providers/UserProvider';
/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme();
  const { user } = useUser();
  const theme = user?.theme || 'system';
  
  useEffect(() => {
    setHasHydrated(true);
  }, [])

  if (hasHydrated) {
    if (theme === 'dark') return 'dark' as ColorSchemeName;
    if (theme === 'light') return 'light' as ColorSchemeName;
    else return colorScheme;
  }

  return 'light';
}
