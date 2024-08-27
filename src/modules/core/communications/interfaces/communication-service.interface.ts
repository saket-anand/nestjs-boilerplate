export interface CommunicationService {
  send(recipient: string, content: string, options?: any): Promise<void>;
}
