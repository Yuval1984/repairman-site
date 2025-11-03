import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const EXTERNAL_SERVER_URL = 'https://metrics-server-yjqf.onrender.com/v1';

// No SMTP config object needed in payload anymore

export interface SendMailResponse {
  success?: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  localOpen?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SendMailService {
  constructor(private http: HttpClient) {}

  // When true, open a mailto link instead of calling the API
  shouldSendMailLocally = true;

  /**
   * Send email via external mail server
   * @param to Recipient email address
   * @param subject Email subject
   * @param html HTML email body
   * @param smtpConfig SMTP configuration with user and password
   * @param text Optional plain text email body
   * @returns Observable with send mail response
   */
  sendEmail(to: string, subject: string, html: string, from: string, text?: string): Observable<SendMailResponse> {
    if (this.shouldSendMailLocally && typeof window !== 'undefined') {
      const fixedTo = 'Joelkr@gmail.com';
      const localSubject = 'תיקון מכשיר ביתי - פנייה מהאתר';
      const normalizedText = (text && typeof text === 'string' ? text : html
        .replace(/<br\s*\/?>(\n)?/gi, '\n')
        .replace(/<\/(p|div)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim())
        // normalize to CRLF for Outlook
        .replace(/\r?\n/g, '\r\n');
      // Prefix each line with Right-To-Left mark for Outlook rendering
      const body = normalizedText
        .split('\r\n')
        .map(line => "\u200F" + line)
        .join('\r\n');
      const mailtoUrl = `mailto:${encodeURIComponent(fixedTo)}?subject=${encodeURIComponent(localSubject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      return of({ success: true, message: 'Opened mail client', localOpen: true });
    }

    const payload = { to, subject, html, from };
    return this.http.post<SendMailResponse>(`${EXTERNAL_SERVER_URL}/email/send`, payload);
  }
}

