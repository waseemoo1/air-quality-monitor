import { io, Socket } from 'socket.io-client';
import { AirQualityAlert } from '../types/alert';

const SOCKET_URL = 'http://185.158.94.165:3001';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onConnect(callback: () => void) {
    this.socket?.on('connect', callback);
  }

  onDisconnect(callback: () => void) {
    this.socket?.on('disconnect', callback);
  }

  onNewAlert(callback: (alert: AirQualityAlert) => void) {
    this.socket?.on('new_alert', callback);
  }

  // Cleanup listeners to prevent memory leaks in React
  offNewAlert(callback: (alert: AirQualityAlert) => void) {
    this.socket?.off('new_alert', callback);
  }
}

export const socketService = new SocketService();
