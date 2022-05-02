import { CircularProgress } from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react';
import versionJson from './version.json';

export const AppVersionCheck = ({
  children,
}: {
  children: ReactElement<any, any>;
}) => {
  const isProductionEnv = process.env.NODE_ENV === 'production';
  const currentCommit = versionJson.commit;
  const [cacheStatus, setCacheStatus] = useState({
    loading: true,
    isLatestVersion: false,
  });

  useEffect(() => {
    if (isProductionEnv) {
      checkCacheStatus();
    }
  }, []);

  const checkCacheStatus = async () => {
    try {
      const res = await fetch(`/version.json?time=${new Date().getTime()}`);
      const { commit: versionCommit } = await res.json();
      const forceRefresh = currentCommit !== versionCommit;
      if (forceRefresh) {
        setCacheStatus({
          loading: false,
          isLatestVersion: false,
        });
      } else {
        setCacheStatus({
          loading: false,
          isLatestVersion: true,
        });
      }
    } catch (error) {
      setCacheStatus({
        loading: false,
        isLatestVersion: true,
      });
    }
  };

  const refreshCacheAndReload = async () => {
    try {
      if (window?.caches) {
        const { caches } = window;
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          caches.delete(cacheName);
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('An error occurred while deleting the cache.', true);
    }
  };

  if (!isProductionEnv) {
    return children;
  } else {
    if (cacheStatus.loading) {
      return (
        <div
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    if (!cacheStatus.loading && !cacheStatus.isLatestVersion) {
      refreshCacheAndReload();
      return null;
    }
    return children;
  }
};
