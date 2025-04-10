import { QRCodeCanvas } from 'qrcode.react';
import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';

export const Answerer = ({ qrChunks }: { qrChunks: any[] }) => {
  const [visibleQr, setVisibleQr] = useState<number>(0);
  const [delay, setDelay] = useState(500);

  useInterval(async () => {
    const rem = (visibleQr + 1) % qrChunks.length;
    setVisibleQr(rem);
  }, delay);

  return (
    <div>
      <h4>📤 Ответ: покажи эти QR инициатору</h4>
      {qrChunks.map((chunk, i) => {
        const { partNumber, totalChunks } = chunk;
        const qrData = `${chunk.chunk}|Part:${partNumber}/${totalChunks}`; // Форматируем данные с информацией о частях

        return (
          <QRCodeCanvas
            key={i}
            className={i !== visibleQr ? `hidden` : ''}
            value={qrData}
            size={300}
            level="L"
            style={{ margin: 8 }}
            width={300}
            height={300}
          />
        );
      })}
    </div>
  );
};
