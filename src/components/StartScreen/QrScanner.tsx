import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type Props = {
  onScan: (data: string) => void;
};

export const QrScanner = ({ onScan }: Props) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const readerId = 'reader';

    const startScanner = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      const qr = new Html5Qrcode(readerId);
      scannerRef.current = qr;

      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onScan(decodedText);
          },
          (errorMessage) => {
            // ignore scan errors
          },
        );
      } catch (err) {
        console.error('QR start error:', err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning && isRunningRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .then(() => {
            isRunningRef.current = false;
            scannerRef.current = null;
          })
          .catch((err) => {
            console.error('Failed to stop QR scanner', err);
          });
      }
    };
  }, [onScan]);

  return <div id="reader" style={{ width: 300 }} />;
};
