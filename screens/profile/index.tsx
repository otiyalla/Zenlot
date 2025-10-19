import React from 'react';
import { ProfilePage } from '@/components/pages';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function Profile() {
  const { logout } = useAuth();
  const handleEditProfile = () => {
    router.push('/(protected)/(profile)');
  };


  const handleAppearance = () => {
    router.push('/(protected)/(profile)/appearance');
  }

  const handlePasswordChange = () => {
    router.push('/(protected)/(profile)/passwordchange');
  }

  const handleRules = () => {
    router.push('/(protected)/(profile)/tradingrules');
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <ProfilePage
      onEditProfile={handleEditProfile}
      onAppearance={handleAppearance}
      onPasswordChange={handlePasswordChange}
      onRules={handleRules}
      onLogout={handleLogout}
    />
  );
}

