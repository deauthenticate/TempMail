import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Mail } from '../types/mail';
import { formatDate } from '../utils/dateUtils';

interface MailItemProps {
  mail: Mail;
  expanded: boolean;
  toggleExpand: () => void;
}

const MailItem: React.FC<MailItemProps> = ({ mail, expanded, toggleExpand }) => {
  return (
    <div className={`mail-item ${expanded ? 'expanded' : ''}`}>
      <div className="mail-header" onClick={toggleExpand}>
        <div className="mail-sender">
          <span className="from">{mail.from}</span>
        </div>
        <div className="mail-summary">
          <div className="subject">{mail.subject}</div>
          <div className="timestamp">{formatDate(mail.timestamp)}</div>
        </div>
        <div className="expand-icon">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {expanded && (
        <div className="mail-content">
          <div className="mail-details">
            <div className="detail-row">
              <span className="label">From:</span>
              <span className="value">{mail.from}</span>
            </div>
            <div className="detail-row">
              <span className="label">To:</span>
              <span className="value">{mail.to}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{formatDate(mail.timestamp, true)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Subject:</span>
              <span className="value">{mail.subject}</span>
            </div>
          </div>
          <div className="content-body">
            {mail.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MailItem;