// src/components/CookieConsentBanner.js

import React from 'react';
import CookieConsent from 'react-cookie-consent';

const CookieConsentBanner = () => (
  <CookieConsent
    location="bottom"
    buttonText="Accept"
    declineButtonText="Decline"
    enableDeclineButton
    onAccept={() => {
      // Handle acceptance (e.g., enable analytics)
    }}
    onDecline={() => {
      // Handle rejection (e.g., disable analytics)
    }}
  >
    We use cookies to enhance your experience. By clicking "Accept", you agree to our use of cookies.
  </CookieConsent>
);

export default CookieConsentBanner;
