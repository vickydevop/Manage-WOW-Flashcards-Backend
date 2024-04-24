import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import ResponseInterface from 'src/models/interface/responce.interface';
import { YourPaidGlobalWowFlashcardsService } from '../../services/your-paid-global-wow-flashcards/your-paid-global-wow-flashcards.service';
@ApiTags('Your Paid Global WOW Flashcards')
@Controller('your-paid-global-wow-flashcards')
export class YourPaidGlobalWowFlashcardsController {
    constructor(private _apiService: YourPaidGlobalWowFlashcardsService, private _authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-recommended-wow-global-flashcards-list-based-on-login-user-id')
    async GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;

                const result = await this._apiService.GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId(
                    country_code, 
                    customer_id, 
                    user_id
                    );

            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: result,
            };
        } catch (error) {
            throw error;
        }
}
}
