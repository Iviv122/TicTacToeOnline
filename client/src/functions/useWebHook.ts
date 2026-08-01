import { useCallback, useEffect, useRef } from "react";
import type { components } from "../schema";
import type { Message } from "../types/message";

interface useWebSocketOptions {
  onMessage?: (data: components["schemas"]["MessageSchema"]) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  reconnect?: boolean;
}

export default function useWebSocket(
  url: string,
  options: useWebSocketOptions = {},
) {
  const { onMessage, onOpen, onClose, reconnect = true } = options;
  const wsRef = useRef<WebSocket>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);
    wsRef.current = socket;

    socket.onopen = () => {
      attemptRef.current = 0;
      onOpen?.();
    };

    socket.onmessage = (event) => {
      onMessage?.(JSON.parse(event.data));
    };

    socket.onclose = (event) => {
      onClose?.(event);
      if (reconnect && event.code !== 1000) {
        const attempt = attemptRef.current;
        if (attempt >= 10) return; // stop after 10 attempts

        const baseDelay = Math.min(1000 * 2 ** attempt, 30000);
        const jitter = Math.random() * 1000;
        const delay = baseDelay + jitter;

        reconnectTimer.current = setTimeout(() => {
          attemptRef.current += 1;
          connect();
        }, delay);
      }
    };

    socket.onerror = () => socket.close();
  }, [url, onMessage, onOpen, onClose, reconnect]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current !== null) {
        clearTimeout(reconnectTimer.current);
      }
      wsRef.current?.close(1000, "hook cleanup");
    };
  }, [connect]);

  const send = useCallback((data: Message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { send, wsRef };
}
