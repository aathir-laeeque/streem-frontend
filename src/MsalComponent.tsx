import { apiAuthExtras } from '#utils/apiUrls';
import { request } from '#utils/request';
import {
  AuthenticationResult,
  Configuration,
  EventMessage,
  EventType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import React, { ReactElement, useEffect, useState } from 'react';

export const MsalComponent = ({ children }: { children: ReactElement }) => {
  const [config, setConfig] = useState<Configuration>();
  let msalInstance: PublicClientApplication | undefined = undefined;
  if (config && !msalInstance) {
    msalInstance = new PublicClientApplication(config);
    msalInstance.addEventCallback((event: EventMessage) => {
      if (msalInstance && event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        if (payload?.account?.idTokenClaims?.login_hint)
          localStorage.setItem('loginHint', payload?.account?.idTokenClaims?.login_hint);
        msalInstance.setActiveAccount(payload.account);
      }
    });
  }

  useEffect(() => {
    const { hostname } = window.location;
    const fetchExtras = async () => {
      const response = await request('GET', apiAuthExtras(), {
        params: {
          fqdn: hostname,
        },
      });
      if (response.data?.extras) {
        const { extras } = response.data;
        setConfig({
          auth: {
            clientId: extras.clientId,
            authority: `https://login.microsoftonline.com/${extras.tenantId}`,
            redirectUri: '/',
            postLogoutRedirectUri: '/',
          },
        });
      }
    };
    fetchExtras();
  }, []);

  if (!msalInstance) {
    return children;
  } else {
    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
  }
};
