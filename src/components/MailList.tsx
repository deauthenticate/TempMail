import React, { useState } from 'react';
import { Mail } from '../types/mail';
import MailItem from './MailItem';

interface MailListProps {
  mails: Mail[];
  loading: boolean;
}

const MailList: React.FC<MailListProps> = ({ mails, loading }) => {
  const [expandedMailId, setExpandedMailId] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    if (expandedMailId === index) {
      setExpandedMailId(null);
    } else {
      setExpandedMailId(index);
    }
  };

  if (loading && mails.length === 0) {
    return (
      <div className="mail-list-container empty">
        <div className="loading-spinner"></div>
        <p>Checking for emails...</p>
      </div>
    );
  }

  if (mails.length === 0) {
    return (
      <div className="mail-list-container empty">
        <div className="empty-state">
          <p>No emails yet</p>
          <span>New messages will appear here automatically</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mail-list-container">
      {mails.map((mail, index) => (
        <MailItem
          key={index}
          mail={mail}
          expanded={expandedMailId === index}
          toggleExpand={() => toggleExpand(index)}
        />
      ))}
    </div>
  );
};

export default MailList;