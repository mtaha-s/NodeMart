import React from 'react';
import { useAuth } from '../../context/AuthContext';
// import './Avatar.css';

export function Avatar({ className = '', size = 'md' }) {
  const { user } = useAuth();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-2 h-2',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative flex shrink-0 overflow-hidden rounded-full bg-linear-to-br from-blue-400 to-purple-500 ${sizeClass} ${className}`}
      title={user?.fullName}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user?.fullName || 'User avatar'}
        //   className="aspect-square w-2 h-2 object-cover"
        className={`aspect-square object-cover ${sizeClass}`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      <div
        className="flex w-full h-full items-center justify-center bg-linear-to-br from-blue-400 to-purple-500 text-white font-semibold text-sm"
        style={{
          display: user?.avatar ? 'none' : 'flex',
        }}
      >
        {getInitials(user?.fullName || 'User')}
      </div>
    </div>
  );
}

export default Avatar;