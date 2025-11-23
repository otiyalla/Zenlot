import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { TradeProvider } from '@/providers/TradeProvider';
import { WebsocketProvider } from '@/providers/WebsocketProvider';
import { GluestackUIProvider } from "@/components/design-system/ui";
import { useUser } from "@/providers/UserProvider";
export const unstable_settings = {
    initialRouteName: "(tabs)"
}

export default function ProtectedLayout() {
    const { isAuthenticated, authChecked } = useAuth();
    const { user } = useUser();
    const theme = (user?.theme) as 'light' | 'dark' | 'system';
    
    if (!authChecked) return null;
    if (!isAuthenticated) return <Redirect href="/(auth)" />;

    return (
      <GluestackUIProvider mode={theme}> 
        <WebsocketProvider>
            <TradeProvider>
                <Stack   
                /*screenOptions={
                    {
                        //headerStyle: {
                            //  backgroundColor: 'transparent',
                            //},
                            //headerTintColor: 'white',
                            //headerTitleStyle: {
                                //  fontWeight: 'bold',
                                //},
                                //headerTitleAlign: 'center',
                                //headerBackTitleVisible: false,
                                //headerBackTitle: 'Back',
                                //headerBackVisible: true,
                                //headerShown: false,
                                //animation: 'fade_from_bottom',
                                //contentStyle: {
                                    //  backgroundColor: 'transparent',
                                    //},
                                    //localize('user.appearance_language'),
                                    } 
                                    }*/
                                   >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(profile)"
                    options={{
                        headerShown: false,
                        animation: 'fade_from_bottom'
                    }} 
                    />
                <Stack.Screen name="forex" options={{ 
                    //presentation: "modal",
                    title: "Forex" 
                }} />
                <Stack.Screen name="+not-found" />
                </Stack>
            </TradeProvider>
        </WebsocketProvider>
       </GluestackUIProvider>
    );
}