/**
 * Component for displaying feedback messages (success, error, rare word, pangram)
 */

import type { Message as MessageType } from '../types/game';
import '../styles/Message.css';

interface MessageProps {
  message: MessageType | null;
}

/**
 * Displays temporary messages to provide feedback on word submissions
 * Message types: error (red), success (green), rare (special), pangram (gold)
 */
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
