import { Injectable } from '@nestjs/common';
import {
    TextractClient,
    DetectDocumentTextCommand,
} from '@aws-sdk/client-textract';

@Injectable()
export class AwsTextractService {
    private readonly client = new TextractClient({
        region: process.env.AWS_REGION || 'us-east-2',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    async extractTextFromBuffer(buffer: Buffer) {
        try {
            const command = new DetectDocumentTextCommand({
                Document: {
                    Bytes: buffer,
                },
            });

            const result = await this.client.send(command);

            const lines =
                result.Blocks
                    ?.filter((block) => block.BlockType === 'LINE')
                    .map((block) => block.Text)
                    .filter(Boolean) || [];

            return {
                success: true,
                fullText: lines.join('\n'),
                lines,
            };
        } catch (error: any) {
            console.error('Textract error:', error);

            return {
                success: false,
                fullText: '',
                lines: [],
                reason: 'OCR extraction failed',
            };
        }
    }
}