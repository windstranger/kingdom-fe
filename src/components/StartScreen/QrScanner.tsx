import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

type Props = {
  onScan: (data: string) => void;
};

export const QrScanner = ({ onScan }: Props) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { disableFlip: true, fps: 10, qrbox: 250 },
      false,
    );
    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        // scanner.clear(); // остановим сканер после успешного чтения
      },
      (err) => {
        // console.warn(err)
      },
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return <div id="reader" style={{ width: 300 }} />;
};
