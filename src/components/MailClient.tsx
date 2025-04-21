import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Mail, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import MailList from './MailList';
import { generateRandomEmail } from '../utils/emailUtils';
import { fetchMails } from '../api/mailApi';
import { Mail as MailType } from '../types/mail';

const MailClient: React.FC = () => {
  const [emailUsername, setEmailUsername] = useState<string>(generateRandomEmail(12));
  const [domain, setDomain] = useState<string>('mailsv2.cybervilla.xyz');
  const [mails, setMails] = useState<MailType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fullEmail = `${emailUsername}@${domain}`;

  const handleGenerateEmail = () => {
    setEmailUsername(generateRandomEmail(12));
    setMails([]);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailUsername(e.target.value);
    setMails([]);
  };

  const handleDomainSelect = (newDomain: string) => {
    setDomain(newDomain);
    setMails([]);
  };

  const fetchMailData = useCallback(async () => {
    if (!emailUsername) return;
    
    setLoading(true);
    try {
      const mailData = await fetchMails(fullEmail);
      setMails(mailData);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching mails:', error);
    } finally {
      setLoading(false);
    }
  }, [emailUsername, fullEmail]);

  const handleRefresh = () => {
    fetchMailData();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchMailData();
    const interval = setInterval(fetchMailData, 10000);
    return () => clearInterval(interval);
  }, [fetchMailData]);

  const getTimeSinceRefresh = () => {
    const seconds = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="text-primary h-8 w-8 neon-effect" />
          <h1 className="text-4xl font-bold gradient-text">TempMail</h1>
        </div>
        <p className="text-muted-foreground">Secure Temporary Mails | Keep Your Inbox Clean</p>
      </div>

      <div className="glass p-6 mb-8 rounded-lg">
        <div className="space-y-4">
          <div className="input-wrapper relative">
            <input
              type="text"
              value={emailUsername}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              className="email-input"
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="domain-selector">
                <div className="flex items-center gap-1">
                  @{domain}
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="dropdown-content" 
                  sideOffset={5}
                  align="end"
                  alignOffset={-5}
                >
                  <DropdownMenu.Item 
                    className="dropdown-item"
                    onSelect={() => handleDomainSelect('mailsv2.cybervilla.xyz')}
                  >
                    mailsv2.cybervilla.xyz
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="button-group">
            <button className="cyber-button" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button className="cyber-button generate" onClick={handleGenerateEmail}>
              Generate Random
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-lg overflow-hidden">
        <div className="p-4 border-b border-primary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-sm font-mono text-primary">{fullEmail}</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Refreshed {getTimeSinceRefresh()}</span>
            <button 
              className={`refresh-button ${loading ? 'loading' : ''}`} 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 refresh-icon" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <MailList mails={mails} loading={loading} />
      </div>
    </div>
  );
};

export default MailClient;