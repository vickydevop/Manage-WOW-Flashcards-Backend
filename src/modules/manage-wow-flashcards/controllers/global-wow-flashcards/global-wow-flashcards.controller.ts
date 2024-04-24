import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GlobalWowFlashcardsService } from '../../services/global-wow-flashcards/global-wow-flashcards.service';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import ResponseInterface from 'src/models/interface/responce.interface';
import { Request } from 'express';
import { get_table_for_global_wow_flashcards, insert_update_flag_data } from 'src/models/dto/user.dto';
@ApiTags('Global WOW Flashcards')
@Controller('global-wow-flashcards')
export class GlobalWowFlashcardsController {
    constructor(private _apiService:GlobalWowFlashcardsService,private _authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('get-table-data-based-on-relevant-syllabus-and-syllabus-id')
    async GetTableDataBasedOnRelevantSyllabusAndSyllabusId(
        @Body() data:get_table_for_global_wow_flashcards,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetTableDataBasedOnRelevantSyllabusAndSyllabusId(
                customer_id,
                country_code,
                user_id,
                data
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
    @Post('insert-or-update-based-on-global-wow-flashcard-id-rating')
    async InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating(
        @Query('global_wow_flashcards_id') global_wow_flashcards_id:string,
        @Query('rating_value') rating_value:string,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id,time_zone_iana_string } = _data;


            const result = await this._apiService.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
                global_wow_flashcards_id,
                rating_value
            );

            return {
                statusCode: 201,
                message: ResponseMessageEnum.ADD,
                data: result,
            };
        } catch (error) {
            throw error;
        }

    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('insert-or-update-based-on-global-wow-flashcard-id-flag')
    async InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag(
        @Body() data:insert_update_flag_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string} = _data;


            const result = await this._apiService.InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag(
                customer_id,
                country_code,
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
            throw error;
        }

    }
}
