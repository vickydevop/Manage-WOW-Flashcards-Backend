import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AssignWowFlashcardsToStudentsService } from '../../services/assign-wow-flashcards-to-students/assign-wow-flashcards-to-students.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import ResponseInterface from 'src/models/interface/responce.interface';
import { Request } from 'express';

@ApiTags('Assign WOW Flashcards To Students')
@Controller('assign-wow-flashcards-to-students')
export class AssignWowFlashcardsToStudentsController {
    constructor(private _apiService: AssignWowFlashcardsToStudentsService, private _authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-users-subjects-course-assigned-to-you')
    async getUsersSubjectsCourseAssignedToYou(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, is_default_academic_year_format_spanning_two_calendar_years } = _data;


            const result = await this._apiService.getUsersSubjectsCourseAssignedToYou(
                customer_id,
                country_code,
                user_id,
                is_default_academic_year_format_spanning_two_calendar_years
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
    @Get('get-table-data-based-on-course-subject-user-category-allocation-id')
    async GetTableDataBasedOnCourseSubjectUserCategoryAllocationId(
        @Query('course_subject_user_category_allocation_id') course_subject_user_category_allocation_id:number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetTableDataBasedOnCourseSubjectUserCategoryAllocationId(
                country_code,
                customer_id,
                user_id,
                course_subject_user_category_allocation_id
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
    @Post('update-selected-allocation-id-field')
    async UpdateSelectedAllocationIdField(
        @Query('course_subject_user_category_allocation_id') course_subject_user_category_allocation_id:number,
        @Query('wow_class_stream_reference_id') wow_class_stream_reference_id:number,
        @Query('is_removed') is_removed:number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id,time_zone_iana_string } = _data;


            const result = await this._apiService.UpdateSelectedAllocationIdField(
                country_code,
                customer_id,
                user_id,
                time_zone_iana_string,
                course_subject_user_category_allocation_id,
                wow_class_stream_reference_id,
                is_removed
            );

            return {
                statusCode: 200,
                message: ResponseMessageEnum.UPDATE,
                data: result,
            };
        } catch (error) {
            throw error;
        }

    }
}
