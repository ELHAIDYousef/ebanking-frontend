import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface Message {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {

  isOpen: boolean = false;
  isLoading: boolean = false;
  userMessage: string = '';
  messages: Message[] = [
    {
      role: 'bot',
      text: 'Hello! I am your E-Banking assistant. Ask me anything about customers, accounts or balances!',
      time: this.getCurrentTime()
    }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.cdr.detectChanges();
  }

  sendMessage(): void {
    if (!this.userMessage.trim() || this.isLoading) return;

    const userMsg = this.userMessage.trim();
    this.userMessage = '';

    this.messages.push({
      role: 'user',
      text: userMsg,
      time: this.getCurrentTime()
    });

    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.post<any>(`${environment.backendUrl}/chat`, {
      message: userMsg
    }).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'bot',
          text: response.response,
          time: this.getCurrentTime()
        });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => {
        this.messages.push({
          role: 'bot',
          text: 'Sorry, I encountered an error. Please try again.',
          time: this.getCurrentTime()
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 50);
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}