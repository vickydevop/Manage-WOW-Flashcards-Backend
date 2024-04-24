import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { YourWowFlashcardsService } from '../../services/your-wow-flashcards/your-wow-flashcards.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import ResponseInterface from 'src/models/interface/responce.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { Request } from 'express';
import { GetTableData, get_all_audit_trail_values_based_on_res, get_hidden_wow_flashcards_or_update, get_tree_view_data, linked_syllabus_share_and_unshare, list_of_linked_syllabus_add_update_popup, recommend_teaching_faculty_data, remove_list_of_linekd_syllabus, resolve_flag_data } from 'src/models/dto/user.dto';

@ApiTags('Your WOW Flashcards')
@Controller('your-wow-flashcards')
export class YourWowFlashcardsController {
    constructor(private _apiService: YourWowFlashcardsService, private _authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('check-and-create-all-flashcards-table')
    async CheckAndCreateAllTables(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.CheckAndCreateAllTables(
                customer_id,
                country_code,
                user_id
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
    @Get('get-all-relevant-syllabus-of-your-interest-from')
    async GetAllRelevantSyllabusOfYourInterestFrom(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetAllRelevantSyllabusOfYourInterestFrom(
                customer_id,
                country_code,
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
    @Post('get-tree-view-based-on-above-selected-id')
    async GetTreeViewBasedOnAboveSelectedId(
        @Body() get_tree_view_data: get_tree_view_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetTreeViewBasedOnAboveSelectedId(
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('get-hidden-wow-flashcards-or-update-hide')
    async GetHiddenWOWFlashcardsOrUpdateHide(
        @Body() data: get_hidden_wow_flashcards_or_update,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id,time_zone_iana_string } = _data;


            const result = await this._apiService.GetHiddenWOWFlashcardsOrUpdateHide(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
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
    @Post('get-table-data-based-on-above-selected-relevant-syllabus-and-syllabus-id')
    async GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId(
        @Body() data: GetTableData,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId(
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

    // Resolve Flags 
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-data-based-on-global-wow-flashcards-resolve-flags')
    async GetDataBasedOnGlobalWowFlashcardsResolvedFlags(
        @Query('global_wow_flashcards_id') global_wow_flashcards_id: number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetDataBasedOnGlobalWowFlashcardsResolvedFlags(
                customer_id,
                country_code,
                global_wow_flashcards_id
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
    @Post('insert-or-update-resolve-flag')
    async UpdateResolveFlag(
        @Body() resolve_flag: resolve_flag_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id,time_zone_iana_string } = _data;


            const result = await this._apiService.UpdateResolveFlag(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
                resolve_flag
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

    // Recommend 
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-recommend-popup-teaching-faculty-user')
    async GetRecommendTeachingFacultyUsers(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetRecommendTeachingFacultyUsers(
                customer_id,
                country_code,
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
    @Get('get-recommend-popup-registered-users')
    async GetRecommendTeachingRegisteredUsers(
        @Query('user_category_id') user_category_id: string,
        @Query('is_global_wow_flashcards') is_global_wow_flashcards: number,
        @Query('global_wow_flashcards_id') global_wow_flashcards_id: number,
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetRecommendTeachingRegisteredUsers(
                customer_id,
                country_code,
                user_category_id,
                is_global_wow_flashcards,
                global_wow_flashcards_id,
                institutional_wow_flashcards_id
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
    @Post('insert-or-update-recommend-teaching-faculty-users')
    async InsertOrUpdateRecommendTeachingFacultyUsers(
        @Body() recommend: recommend_teaching_faculty_data,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id,time_zone_iana_string } = _data;


            const result = await this._apiService.InsertOrUpdateRecommendTeachingFacultyUsers(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
                recommend
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

    // List of Courses / Subjects linked to WOW FlashCards
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('list-of-linked-syllabus-based-on-wow-flashcards')
    async List_of_Linked_Syllabus_BasedOn_Wow_flashcards(
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: number,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.List_of_Linked_Syllabus_BasedOn_Wow_flashcards(
                customer_id,
                country_code,
                user_id,
                institutional_wow_flashcards_id
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
    @Post('list-of-linked-syllabus-shared-and-unshared')
    async ListOfLinedSyllabusSharedAndUnShared(
        @Body() data: linked_syllabus_share_and_unshare,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.ListOfLinedSyllabusSharedAndUnShared(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
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
    @Get('list-of-linked-syllabus-link-new-relevant-syllabus')
    async ListOfLinedSyllabusLinkNewRelevantSyllabus(
        @Req() request: Request,
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: string,
    ): Promise<ResponseInterface | any> {
        try {
            let token;
            if (request.headers.authorization)
                token = String(request.headers.authorization).replace('Bearer ', '');
            if (request.headers.authenticationtoken)
                token = String(request.headers.authenticationtoken).replace(
                    'Bearer ',
                    '',
                );
            const _data = await this._authService.verifyJwt(token).then(data => data.user)
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.ListOfLinedSyllabusLinkNewRelevantSyllabus(
                country_code,
                customer_id,
                user_id,
                institutional_wow_flashcards_id
            );

            return result
        } catch (error) {
            throw error;
        }


    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('list-of-linked-syllabus-edit-link-popup-relevant-syllabus')
    async ListOfLinedSyllabusEditLinkRelevantSyllabus(
        @Query('course_subject_id') course_subject_id: string,
        @Query('institutional_wow_flashcards_id') institutional_wow_flashcards_id: string,
        @Query('is_global') is_global: boolean,
        @Req() request: Request,
    ): Promise<ResponseInterface | any> {
        try {
            let token;
            if (request.headers.authorization)
                token = String(request.headers.authorization).replace('Bearer ', '');
            if (request.headers.authenticationtoken)
                token = String(request.headers.authenticationtoken).replace(
                    'Bearer ',
                    '',
                );
            const _data = await this._authService.verifyJwt(token).then(data => data.user)
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.ListOfLinedSyllabusEditLinkRelevantSyllabus(
                country_code,
                customer_id,
                user_id,
                institutional_wow_flashcards_id,
                course_subject_id,
                is_global
            );

            return result
        } catch (error) {
            throw error;
        }


    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('list-of-linked-syllabus-add-and-edit-link-popup')
    async ListOfLinkedSyllabusAddAndUpdate(
        @Body() data: list_of_linked_syllabus_add_update_popup,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.ListOfLinkedSyllabusAddAndUpdate(
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

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('list-of-linked-syllabus-remove')
    async ListOfLinkedSyllabusRemove(
        @Body() data: remove_list_of_linekd_syllabus,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.ListOfLinkedSyllabusRemove(
                customer_id,
                country_code,
                user_id,
                time_zone_iana_string,
                data
            );

            return {
                statusCode: 204,
                message: ResponseMessageEnum.DELETE,
                data: result,
            };
        } catch (error) {
            throw error;
        }

    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('get-all-wow-flashcards')
    async GetAllWowFlashcards(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id, time_zone_iana_string } = _data;


            const result = await this._apiService.GetAllWowFlashcards(
                country_code,
                customer_id,
                user_id
            );

            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: result,
            }
        } catch (error) {
            throw error;
        }


    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post('get-all-audit-trail-values-based-on-responses')
    async GetAllAuditTrailValuesBasedOnResponses(
        @Body() data: get_all_audit_trail_values_based_on_res,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = String(req.headers.authorization).replace('Bearer ', '');
            const _data = await this._authService
                .verifyJwt(token)
                .then((data) => data.user);
            const { customer_id, country_code, user_id } = _data;


            const result = await this._apiService.GetAllAuditTrailValuesBasedOnResponses(
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
}
