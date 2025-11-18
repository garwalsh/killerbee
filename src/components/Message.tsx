import type { Message as MessageType } from '../types/game';
import '../styles/Message.css';

interface MessageProps {
  message: MessageType | null;
}

export function Message({ message }: MessageProps) {
  if (!message) {
    return <div className="message-container" />;
  }

  const messageClass = `message message-${message.type}`;

  return (
    <div className="message-container">
      <div className={messageClass}>
        {message.text}
      </div>
    </div>
  );
}
