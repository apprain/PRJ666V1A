export class CreateClientAppDto {
  name: string;
  allowedRedirectUrls: string[];
  webhookUrl?: string;
}