import { useState, useEffect } from 'react';
import * as serviceWorker from '../serviceWorker';

interface ServiceWorkerData {
  waitingWorker: ServiceWorker | null;
  newVersionAvailable: boolean;
};

const useServiceWorker = (callback: () => void) => {
  const [serviceWorkerData, setServiceWorkerData] = useState<ServiceWorkerData>();

  useEffect(() => {
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    serviceWorkerData && serviceWorkerData.newVersionAvailable && callback();
    // eslint-disable-next-line
  }, [serviceWorkerData]);

  const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) =>
    setServiceWorkerData({
      waitingWorker: registration && registration.waiting,
      newVersionAvailable: true,
    });

  const updateServiceWorker = () => {
    const waitingWorker = serviceWorkerData?.waitingWorker;
    waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    setServiceWorkerData({ newVersionAvailable: false } as ServiceWorkerData);
    window.location.reload();
  };

  return [updateServiceWorker];
};

export default useServiceWorker;
