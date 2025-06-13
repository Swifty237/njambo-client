import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import config from '../../clientConfig';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    const gtag = window.gtag;

    if (history.action === 'PUSH' && gtag && typeof gtag === 'function') {
      gtag('config', config.googleAnalyticsTrackingId, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }, [location, history]);

  return null;
};

export default GoogleAnalytics;
