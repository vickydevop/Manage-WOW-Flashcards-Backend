import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { MonetizationOfYourWowFlashcardsService } from '../../services/monetization-of-your-wow-flashcards/monetization-of-your-wow-flashcards.service';
import { AuthService } from 'src/auth/services/auth.service';
import { earning_details_data, monetization_prices, monetization_prices_insert_or_update } from 'src/models/dto/user.dto';
import ResponseInterface from 'src/models/interface/responce.interface';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
@ApiTags('Monetization Of Your WOW Flashcards')
@Controller('monetization-of-your-wow-flashcards')
export class MonetizationOfYourWowFlashcardsController {
    constructor(private _apiService: MonetizationOfYourWowFlashcardsService, private _authService: AuthService) { }
    /* ----------------------------------- Monetization of Your WOW FlashCards -----------------------------------------------------*/
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post("get-monetization-of-your-wow-flashcards-list-based-on-subject-ids")
    async GetMonetizationOfYourWowFlashcardsListBasedOnSubjectIds(
        @Body() body: monetization_prices,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, default_currency_shortform } = _data;

            const result = await this._apiService.GetMonetizationOfYourWowFlashcardsListBasedOnSubjectIds(country_code, customer_id, body, user_id, default_currency_shortform);

            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: result,
            };

        } catch (error) {
            throw error
        }
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post("insert-or-update-monetization-of-your-wow-flashcards-monetization-prices")
    async InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(
        @Body() data: monetization_prices_insert_or_update,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(
                country_code,
                customer_id,
                user_id,
                time_zone_iana_string,
                data
            );

            return {
                statusCode: 201,
                message: ResponseMessageEnum.ADD,
                data: result,
            };

        } catch (error) {
            throw error
        }
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get("view-monetization-history-of-your-wow-flashcards-monetization-prices")
    async ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices(
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices(
                country_code,
                customer_id,
                user_id,
                institutional_wow_flashcards_id
            );

            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: result,
            };

        } catch (error) {
            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-monetization-of-your-wow-flashcards')
    async GetAllMonetizationOfYourWowFlashcards(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, default_currency_shortform } = _data;


            const result = await this._apiService.GetAllMonetizationOfYourWowFlashcards(
                country_code,
                customer_id,
                user_id,
                default_currency_shortform
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

    /* -----------------------------------Earnings Details-----------------------------------------------------*/
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('get-all-earning-details-list-based-on-subject-ids-from-earning-details')
    async GetAllEarningDetailsListBasedOnSubjectIds(
        @Body() data: earning_details_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, default_currency_shortform } = _data;

            const result = await this._apiService.GetAllEarningDetailsListBasedOnSubjectIds(
                country_code,
                customer_id,
                user_id,
                default_currency_shortform,
                data
            )

            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: result,
            };
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-earning-details-list-based-on-between-date-from-earning-details')
    async GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails(
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: number,
        @Query('from_date') from_date: string,
        @Query('to_date') to_date: string,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code } = _data;


            const result = await this._apiService.GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails(
                country_code,
                customer_id,
                institutional_wow_flashcards_id,
                from_date,
                to_date,
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-earning-details-of-global-wow-flashcards')
    async GetAllEarningDetailsOfGlobalWowFlashcards(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, default_currency_shortform } = _data;

            const result = await this._apiService.GetAllEarningDetailsOfGlobalWowFlashcards(
                country_code,
                customer_id,
                user_id,
                default_currency_shortform
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
