import { useNetworkState } from 'expo-network';

export default function useNetwork(){
    const networkState = useNetworkState();
    const { type, isConnected, isInternetReachable} = networkState;
    const isOnline = isConnected && isInternetReachable;
    return { isOnline, type };
}