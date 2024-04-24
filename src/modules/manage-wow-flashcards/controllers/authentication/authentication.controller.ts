import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { generate_token } from 'src/models/dto/user.dto';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import ResponseInterface from 'src/models/interface/responce.interface';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private _authService: AuthService,
    ) { }
    @Get('get-token-gen')
    async getTOkenGen(
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            // const payload = {
            //     user_id: 1,
            //     customer_id: 69,
            //     country_code: "in",
            //     customer_sub_domain_name: "team",
            //     registered_educational_institution_name: "bbcdb",
            //     time_zone_iana_string: "Asia/Kolkata",
            //     is_default_academic_year_format_spanning_two_calendar_years: 1,
            //     default_academic_year_start_date_and_month: "6/5",
            //     socket_id: "",
            //     default_currency_shortform:"INR",
            //     educational_institution_category_id: "mcQUnDH0BdFJt74,RLL55SpwKoJhgtH",
            //     user_registered_categories_ids: "I1ejXfDRsHVOcXu,PyZCVnRKCgoSOWL",
            //     user_registration_login_approval_status: 3,
            //     country: "ws",
            //     pin_code: "635752",
            //     state_province: "Tamil Nadu",
            //     city_district_county: "Tirupattur",
            //     address_line_1: "Vaniyambadi",
            //     address_line_2: "Vaniyambadi",
            //     default_currency: 'INR',
            //     institutional_course_subject_id: 7,
            //     institutional_wow_resource_id: 1,
            //     global_wow_resource_id: 1,
            //     access: 0,
            //     user_category_id: "b6Zq0X7PcU1yNfy"
            // }
            const payload = {
                user_id: "1",
                customer_id: 105,
                country_code: "in",
                customer_sub_domain_name: "vk",
                registered_educational_institution_name: "cvicky",
                time_zone_iana_string: "Asia/Calcutta",
                app_name: "vk",
                default_currency_shortform: "INR",
                accounting_standards_id: null,
                is_default_academic_year_format_spanning_two_calendar_years: 1,
                default_academic_year_start_date_and_month: "6/12",
                socket_id: "",
                user_category_type: "4",
                educational_institution_category_id: "6rcZg1MaEONVSPZ",
                user_registered_categories_ids: "w3YoxBJpUHpSCdu",
                user_registration_login_approval_status: 3,
                country: "in",
                pin_code: "rtyry",
                state_province: "Tamil Nadu",
                city_district_county: "Tirupattur",
                address_line_1: "Vaniyambadi",
                address_line_2: "Vaniyambadi",
                customer_type: 0
              }
            // const payload = {
            //     user_id: "1",
            //     customer_id: 105,
            //     country_code: "in",
            //     customer_sub_domain_name: "vk",
            //     registered_educational_institution_name: "cvicky",
            //     time_zone_iana_string: "Asia/Calcutta",
            //     app_name: "vk",
            //     default_currency_shortform: "INR",
            //     accounting_standards_id: null,
            //     is_default_academic_year_format_spanning_two_calendar_years: 1,
            //     default_academic_year_start_date_and_month: "6/12",
            //     socket_id: "",
            //     user_category_type: "4",
            //     educational_institution_category_id: "6rcZg1MaEONVSPZ",
            //     user_registered_categories_ids: "w3YoxBJpUHpSCdu",
            //     user_registration_login_approval_status: 3,
            //     country: "in",
            //     pin_code: "rtyry",
            //     state_province: "Tamil Nadu",
            //     city_district_county: "Tirupattur",
            //     address_line_1: "Vaniyambadi",
            //     address_line_2: "Vaniyambadi",
            //     customer_type: 0,
            //     access:1,
            //     institutional_wow_flashcards_id:13,
            //     global_wow_flashcards_id:null,
            //     is_global:0,
            //     institutional_course_subject_id:1,
            //     global_course_subject_id:1,
            //     syllabus_ids:['PfURHJdpSW1es4Q','wdizACg5NxH6O16','LkJDw6IMwcIh0cC'],
            //     educational_institution_category_country_code:'IN',
            // }

            const token = await this._authService.generateJwt(payload);
            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: token,
            };
        } catch (error) {
            throw error;
        }
    }

    @Post('create-token-based-on-response')
    async CreateTokenBasedOnResponse(
        @Body() payload:generate_token,
        @Req() req: Request,
    ): Promise<ResponseInterface> {
        try {
            const token = await this._authService.CreateTokenBasedOnResponse(payload);
            return {
                statusCode: 200,
                message: ResponseMessageEnum.GET,
                data: token,
            };
        } catch (error) {
            throw error;
        }
    }
}
