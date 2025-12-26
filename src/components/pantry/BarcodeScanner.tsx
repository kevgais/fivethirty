import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Modal } from '../ui';
import { useLookupBarcode } from '../../hooks';
import type { BarcodeResult } from '../../lib/api';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (result: BarcodeResult & { found: true }) => void;
  onManualEntry: (barcode: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onProductFound, onManualEntry }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const lookupBarcode = useLookupBarcode();

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      try {
        setError(null);
        const scanner = new Html5Qrcode('barcode-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 100 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            // Prevent duplicate scans
            if (decodedText === lastScanned) return;
            setLastScanned(decodedText);

            // Stop scanning while we look up
            await scanner.pause(true);
            setIsScanning(false);

            // Lookup the barcode
            try {
              const result = await lookupBarcode.mutateAsync(decodedText);
              if (result.found) {
                onProductFound(result as BarcodeResult & { found: true });
                onClose();
              } else {
                // Product not found, offer manual entry
                onManualEntry(decodedText);
                onClose();
              }
            } catch {
              setError('Failed to lookup barcode. Please try again.');
              await scanner.resume();
              setIsScanning(true);
            }
          },
          () => {
            // Ignore scan errors
          }
        );

        setIsScanning(true);
      } catch (err) {
        console.error('Scanner error:', err);
        setError('Could not access camera. Please check permissions.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      setIsScanning(false);
      setLastScanned(null);
    };
  }, [isOpen]);

  const handleClose = async () => {
    if (scannerRef.current && isScanning) {
      await scannerRef.current.stop().catch(() => {});
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Scan Barcode">
      <div className="space-y-4">
        {/* Scanner viewport */}
        <div
          id="barcode-reader"
          className="w-full rounded-lg overflow-hidden bg-charcoal/10"
          style={{ minHeight: '300px' }}
        />

        {/* Status */}
        {isScanning && !error && (
          <p className="text-center text-mushroom text-sm">
            Point camera at a barcode...
          </p>
        )}

        {lookupBarcode.isPending && (
          <div className="flex items-center justify-center gap-2 text-terracotta">
            <div className="w-4 h-4 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
            <span>Looking up product...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-terracotta/10 text-terracotta rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Manual entry option */}
        <button
          onClick={() => {
            onManualEntry('');
            onClose();
          }}
          className="w-full py-2 text-sage hover:text-terracotta text-sm"
        >
          Enter barcode manually
        </button>
      </div>
    </Modal>
  );
}
