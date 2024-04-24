import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import ResponseInterface from 'src/models/interface/responce.interface';
import { Request } from 'express';
import { RecommendedWowFlashcardsFromOtherTeachingFacultyService } from '../../services/recommended-wow-flashcards-from-other-teaching-faculty/recommended-wow-flashcards-from-other-teaching-faculty.service';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import { get_tree_view_data } from 'src/models/dto/user.dto';
@ApiTags('Recommended WOW Flashcards From Other Teaching Faculty')
@Controller('recommended-wow-flashcards-from-other-teaching-faculty')
export class RecommendedWowFlashcardsFromOtherTeachingFacultyController {
    constructor(private _apiService: RecommendedWowFlashcardsFromOtherTeachingFacultyService, private _authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-recommended-wow-resources-list-based-on-login-user-id')
    async GetAllRecommendedWowResourcesListBasedOnLoginId(
        // @Query("page_no") page_no: number,
        // @Query("per_page") per_page: number
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, default_currency_shortform } = _data;

            const result = await this._apiService.GetAllRecommendedWowResourcesListBasedOnLoginId(
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get("get-all-course-subjects-based-on-institutional-wow-flashcards-id")
    async GetAllCourseSubjectsBasedOnWowFlashcardsId(
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: number,
        @Req() req: Request,
        ): Promise<ResponseInterface> {
            try {
                const token = String(req.headers.authorization).replace('Bearer ', '');
                const _data = await this._authService
                    .verifyJwt(token)
                    .then((data) => data.user);
                const { customer_id, country_code} = _data;
    
            const result = await this._apiService.GetAllCourseSubjectsBasedOnWowFlashcardsId(
                country_code,
                customer_id,
                institutional_wow_flashcards_id,
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
    @Post('get-syllabus-id-based-on-subject-ids-and-flashcards-id')
    async GetSyllabusIdBasedOnSubjectIdAndFlashcardsId(
        @Body()get_tree_view_data:get_tree_view_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetSyllabusIdBasedOnSubjectIdAndFlashcardsId(
                customer_id,
                country_code,
                user_id,
                get_tree_view_data
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
