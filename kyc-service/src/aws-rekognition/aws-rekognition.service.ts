import { Injectable } from '@nestjs/common';
import {
    RekognitionClient,
    CompareFacesCommand,
} from '@aws-sdk/client-rekognition';

@Injectable()
export class AwsRekognitionService {
    private readonly client = new RekognitionClient({
        region: process.env.AWS_REGION || 'ca-central-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
    });

    async compareFaces2(sourceBuffer: Buffer, targetBuffer: Buffer) {
        const command = new CompareFacesCommand({
            SourceImage: {
                Bytes: sourceBuffer,
            },
            TargetImage: {
                Bytes: targetBuffer,
            },
            SimilarityThreshold: 80,
        });

        const result = await this.client.send(command);

        const bestMatch = result.FaceMatches?.[0];

        return {
            matched: !!bestMatch,
            similarity: bestMatch?.Similarity || 0,
            confidence: bestMatch?.Face?.Confidence || 0,
            raw: result,
        };
    }

    async compareFaces(
        sourceBuffer: Buffer,
        targetBuffer: Buffer,
    ) {
        try {
            const command = new CompareFacesCommand({
                SourceImage: {
                    Bytes: sourceBuffer,
                },
                TargetImage: {
                    Bytes: targetBuffer,
                },
                SimilarityThreshold: 80,
            });

            const result = await this.client.send(command);

            const match = result.FaceMatches?.[0];

            return {
                matched: !!match,
                similarity: match?.Similarity || 0,
                confidence: match?.Face?.Confidence || 0,
                reason: match ? null : 'No matching face found',
            };
        } catch (error: any) {
            console.error('Rekognition error:', error);

            return {
                matched: false,
                similarity: 0,
                confidence: 0,
                reason:
                    error?.name === 'InvalidParameterException'
                        ? 'No face detected in one or both images'
                        : 'Face comparison failed',
            };
        }
    }
}