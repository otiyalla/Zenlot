import React from 'react'
import { Spinner } from '@/components/design-system/ui';

export interface SpinnerProps {
  size? : 'small' | 'large';
}

export const Loading: React.FC = () => {
  return (
    <Spinner size='large'  />
  )
}
