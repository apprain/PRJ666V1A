import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateStatementRequestDto } from "./dto/create-statement-request.dto";
import { StatementRequestsService } from "./statement-requests.service";

@Controller("statement-requests")
@UseGuards(JwtAuthGuard)
export class StatementRequestsController {
    constructor(
        private readonly statementRequestsService: StatementRequestsService,
    ) { }

    @Post()
    @UseInterceptors(
        FileInterceptor("consentDocument", {
            storage: diskStorage({
                destination: "./uploads/consent-documents",
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}-${Math.round(
                        Math.random() * 1e9,
                    )}`;

                    callback(
                        null,
                        `${uniqueName}${extname(file.originalname)}`,
                    );
                },
            }),
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
            fileFilter: (req, file, callback) => {
                const allowedTypes = [
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                ];

                if (!allowedTypes.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            "Only PDF, JPG, and PNG files are allowed.",
                        ),
                        false,
                    );
                }

                callback(null, true);
            },
        }),
    )
    create(
        @Body() dto: CreateStatementRequestDto,
        @UploadedFile() consentDocument: Express.Multer.File,
        @Req() req: any,
    ) {
        return this.statementRequestsService.create(
            dto,
            req.user.userId,
            consentDocument,
        );
    }

    @Get("organization")
    findOrganizationRequests(@Req() req: any) {
        return this.statementRequestsService.findAllByOrganization(
            req.user.userId,
        );
    }
}