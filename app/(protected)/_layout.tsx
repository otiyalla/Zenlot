import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { TradeProvider } from '@/providers/TradeProvider';
import { WebsocketProvider } from '@/providers/WebsocketProvider';


export const unstable_settings = {
    initialRouteName: "(tabs)"
}

export default function ProtectedLayout() {
    const { isAuthenticated, authChecked } = useAuth();
    
    if (!authChecked) return null;
    

    if (!isAuthenticated) return <Redirect href="/(auth)" />;

    return (
        <WebsocketProvider>
            <TradeProvider>
                <Stack   screenOptions={
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
                    } 
                }>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="forex" options={{ 
                    //presentation: "modal",
                    title: "Forex" 
                }} />
                <Stack.Screen name="+not-found" />
                </Stack>
            </TradeProvider>
        </WebsocketProvider>
    );
}