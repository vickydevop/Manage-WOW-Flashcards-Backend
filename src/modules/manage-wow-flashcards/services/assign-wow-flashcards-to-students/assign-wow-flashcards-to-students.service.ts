import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import * as mysql from 'mysql2';
import { HelperService } from 'src/common/services/helper/helper.service';
import { DateTimeService } from 'src/common/services/date-time/date-time.service';
@Injectable()
export class AssignWowFlashcardsToStudentsService {

    constructor(private helper: HelperService, private _dateTimeService: DateTimeService) { }
    // getUsersSubjectsCourseAssignedToYou
    async getUsersSubjectsCourseAssignedToYou(
        customer_id,
        country_code,
        user_id,
        calender_format,
    ) {
        try {
            let all_course_details: any[] = [];
            let { institution_study_courses } = await this.data_share(
                country_code,
                customer_id,
                user_id,
            );
            let teaching_faculty_info: any[] = [...institution_study_courses];
            for (
                let it_tf_info = 0;
                it_tf_info < teaching_faculty_info.length;
                it_tf_info++
            ) {
                let { for_academic_year_start, user_category_id } =
                    teaching_faculty_info[it_tf_info];
                let user_info = async (user_category_ids) => {
                    const database_name1 = `${country_code}_${customer_id}_edu_customer_db`;
                    let result: any[] = [];
                    for (let i = 0; i < 1; i++) {
                        let result1 = user_category_ids;
                        let AlldataforStudent: any[] = [];
                        for (let i = 0; i < user_category_id.length; i++) {
                            let result = await dbConnection.query(`
                                                            SELECT * FROM ${database_name1}.2_userapp_user_category
                                                            where user_category_id=${mysql.escape(
                                result1,
                            )};
                                                            `);
                            if (result.length > 0) {
                                result1 = result[0].parent_user_category_id;
                                AlldataforStudent.push(result[0].user_category_name);
                            }
                        }
                        result.push({
                            user_category_name: AlldataforStudent.reverse()
                                .toString()
                                .replace(/,/g, '/'),
                            user_category_id: user_category_id,
                        });
                    }
                    return result;
                };
                let crt_year: any = new String(for_academic_year_start);
                let nxt_year = new Date(
                    new Date(crt_year).setFullYear(new Date(crt_year).getFullYear() + 1),
                ).getFullYear();
                for_academic_year_start =
                    calender_format == 1
                        ? `${crt_year}-${nxt_year
                            .toString()
                            .slice(
                                nxt_year.toString().length - 2,
                                nxt_year.toString().length,
                            )}`
                        : crt_year;
                all_course_details.push(teaching_faculty_info[it_tf_info]);
                Reflect.deleteProperty(
                    teaching_faculty_info[it_tf_info],
                    'for_academic_year_start',
                );
                Object.defineProperties(teaching_faculty_info[it_tf_info], {
                    user_info: {
                        value:
                            user_category_id != undefined
                                ? await user_info(user_category_id)
                                : [],
                        enumerable: true,
                    },
                    for_academic_year_start: {
                        value: for_academic_year_start,
                        enumerable: true,
                    },
                });
            }

            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.GET,
                data: all_course_details,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // data_share
    async data_share(country_code, customer_id, user_id) {
        let institution_study_courses: any[] = [];
        let institution: any[] = [];
        const dbName = `${country_code}_${customer_id}_edu_customer_db`;
        const userapp_schedule_wise_teaching_faculty_and_location = `${dbName}.35_userapp_schedule_wise_teaching_faculty_and_location`;
        const userapp_student_user_category_wise_assigned_courses_subjects = `${dbName}.30_userapp_student_user_category_wise_assigned_courses_subjects`;
        const userapp_institutional_study_subjects_courses = `${dbName}.30_userapp_institutional_study_subjects_courses`;
        const userapp_institutional_study_subjects_courses_details = `${dbName}.30_userapp_institutional_study_subjects_courses_details`;
        const educational_institutions_categories = `edu_user_app_db.educational_institutions_categories`;
        const default_global_subjects_courses_for_educational_Inst_categories = `edu_user_apps_common_data_db.default_global_subjects_courses_for_educational_Inst_categories`;
        const global_registered_wow_customers_master_data =
            'global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data';
        const userapp_user_category_wise_academic_year_terms_semesters = `${dbName}.30_userapp_user_category_wise_academic_year_terms_semesters`;
        // const global_course_subject_of_interest = `${dbName}.${user_id}_user_id_global_course_subject_of_interest`;

        await dbConnection
            .query(
                `select 
          distinct(tbl1.course_subject_user_category_allocation_id),
          tbl2.user_category_id,
          tbl2.term_semester_id,
          tbl2.institutional_course_subject_id,
          tbl2.for_academic_year_start,
          tbl3.global_course_subject_id,
          tbl3.educational_institution_category_id,
          tbl3.educational_institution_category_country_code,
          tbl2.course_subject_user_category_allocation_id,
          case 
            when  tbl2.institutional_course_subject_id is not null 
              then 
              (
                select
                  json_object
                   (
                   'is_global',0,
                   'course_info',
                    (
                     SELECT 
                     (
                  json_object(
                         'id',id,
                         'course_subject_type',course_subject_type,
                         'course_subject_name',course_subject_name,
                         'country_code_of_user_id',country_code_of_user_id
                  ))
                 as course_subject_type 
                     FROM ${userapp_institutional_study_subjects_courses_details}
                     where institutional_course_subject_id = tbl2.institutional_course_subject_id order by effective_from_datetime desc limit 1
                    ),
                    'institution_info',(
                       select 
                       json_object(
                       'educational_institution_category_name',educational_institution_category_name
                        ) from ${educational_institutions_categories} where 
                              country_code =tbl3.educational_institution_category_country_code and educational_institution_category_id = tbl3.educational_institution_category_id limit 1
                     )
               )
            )
          
          end as sub_course_info,
          case 
           when tbl2.term_semester_id is not null
           then (
             select 
              case  term_semester_or_other
               when  0 then  JSON_OBJECT('key','term','value',term_no)
               when  1 then  JSON_OBJECT('key','semester','value',semester_no)
               when  2 then  JSON_OBJECT('key','others','value',other_name) 
               end 
             from  ${userapp_user_category_wise_academic_year_terms_semesters} where term_semester_id = tbl2.term_semester_id
           )
          else null
          end as term_info
          from ${userapp_schedule_wise_teaching_faculty_and_location} as tbl1 left join
          ${userapp_student_user_category_wise_assigned_courses_subjects} as tbl2 
          on tbl1.course_subject_user_category_allocation_id = tbl2.course_subject_user_category_allocation_id left join
          ${userapp_institutional_study_subjects_courses} as tbl3 
          on tbl2.institutional_course_subject_id = tbl3.institutional_course_subject_id
          where tbl1.teaching_faculty_user_id = ${user_id} and tbl1.course_subject_user_category_allocation_id is not null 
          
          `,
            )
            .then((res: any) => {
                for (let i = 0; i < res.length; i++) {
                    let {
                        is_global,
                        course_info,
                        institution_info,
                        global_course_subject_id,
                    } = res[i]?.sub_course_info;
                    // console.log(is_global,course_info,institution_info)
                    // console.log(course_info);
                    // console.log(res[i].global_course_subject_id);
                    // console.log(res[i].educational_institution_category_id);
                    // console.log(res[i].educational_institution_category_country_code);
                    Object.defineProperties(res[i], {
                        is_global: { value: is_global, enumerable: true },
                        course_subject_name: {
                            value:
                                course_info != null ? course_info!.course_subject_name : null,
                            enumerable: true,
                        },
                        course_subject_type: {
                            value:
                                course_info != null ? course_info!.course_subject_type : null,
                            enumerable: true,
                        },
                        educational_institution_category_name: {
                            value: institution_info?.educational_institution_category_name,
                            enumerable: true,
                        },
                    });
                    Reflect.deleteProperty(res[i], 'sub_course_info');
                }
                // let global_ids:any[]=[]
                // for(let i=0;i<res.length;i++){
                //   //  if(res[i].is_global== true){
                //     global_ids.push(res[i])
                //   //  }
                // }
                institution_study_courses = res;
            });
        let prop_val = (tbl, prop) => (tbl.length > 0 ? tbl[0][prop] : null);
        // if (
        //     (await this.helper.tableExists(
        //         `${dbName}`,
        //         `${user_id}_user_id_global_course_subject_of_interest`,
        //     )) == 1
        // ) {
        //     await dbConnection
        //         .query(`select * from ${global_course_subject_of_interest}`)
        //         .then(async (res: any) => {
        //             for (let i = 0; i < res.length; i++) {
        //                 let {
        //                     global_course_subject_id,
        //                     educational_institution_category_country_code,
        //                     educational_institution_category_id,
        //                 } = res[i];
        //                 const global_course_info = await dbConnection.query(`
        //         select * from ${default_global_subjects_courses_for_educational_Inst_categories} where 
        //         global_course_subject_id=${mysql.escape(global_course_subject_id)}
        //         and educational_institutional_category_country_code=${mysql.escape(
        //                     educational_institution_category_country_code,
        //                 )}
        //         and educational_institutional_category_id=${mysql.escape(
        //                     educational_institution_category_id,
        //                 )}
        //         and effective_from_datetime < CURRENT_TIMESTAMP order by effective_from_datetime desc limit 1
        //     `);
        //                 const education_institution_info = await dbConnection.query(
        //                     `select * from ${global_registered_wow_customers_master_data} where customer_id=${customer_id}`,
        //                 );
        //                 institution.push({
        //                     ...res[i],
        //                     educational_institution_category_name: prop_val(
        //                         education_institution_info,
        //                         'registered_educational_institution_name',
        //                     ),
        //                     course_subject_name: prop_val(
        //                         global_course_info,
        //                         'course_subject_name',
        //                     ),
        //                     course_subject_type: prop_val(
        //                         global_course_info,
        //                         'course_subject_type',
        //                     ),
        //                     is_global: 1,
        //                 });
        //             }
        //         });
        // }
        let flr_from_institution_study_courses = (key) => {
            // console.log(key,'ke')
            let {
                global_course_subject_id,
                educational_institution_category_id,
                educational_institution_category_country_code,
            } = key;
            return institution_study_courses.filter((item: any) => {
                if (
                    item.is_global == true &&
                    item.global_course_subject_id == global_course_subject_id &&
                    item.educational_institution_category_id ==
                    educational_institution_category_id &&
                    item.educational_institution_category_country_code ==
                    educational_institution_category_country_code
                ) {
                    return true;
                }
            });
        };
        let inst: any[] = [];
        for (let i = 0; i < institution.length; i++) {
            if (flr_from_institution_study_courses(institution[i]).length == 0) {
                inst.push(institution[i]);
            }
        }
        return {
            institution_study_courses,
            inst,
        };
    }
    // GetTableDataBasedOnCourseSubjectUserCategoryAllocationId
    async GetTableDataBasedOnCourseSubjectUserCategoryAllocationId(
        country_code,
        customer_id,
        user_id,
        course_subject_user_category_allocation_id
    ) {
        try {
            // console.log(course_subject_user_category_allocation_id,'course_subject_user_category_allocation_id')
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let final_values: any = [];
            if (await this.helper.tableExists(`${dbName}`, `36_userapp_${course_subject_user_category_allocation_id}_course_user_cat_allocation_id_class_stream`) == 1) {
                await dbConnection.query(`
                select * from ${dbName}.36_userapp_${course_subject_user_category_allocation_id}_course_user_cat_allocation_id_class_stream 
                where wow_class_stream_type  = 4;
                `).then(async (res) => {
                    // console.log(res)
                    if (await this.helper.tableExists(`${dbName}`, `36_userapp_${course_subject_user_category_allocation_id}_cors_user_cat_alloc_id_linked_flshcrds`) == 1) {
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res.length,res[i],'jjj')
                            const get_dta = await dbConnection.query(`
                            select * from ${dbName}.36_userapp_${course_subject_user_category_allocation_id}_cors_user_cat_alloc_id_linked_flshcrds
                            where wow_class_stream_reference_id = ${mysql.escape(res[i].wow_class_stream_reference_id)} and is_institutional_flashcards is not null
                            `);
                            // console.log(res[i].wow_class_stream_reference_id,)
                            if (get_dta[0]?.is_institutional_flashcards == 1) {
                                // local 
                                const values = await dbConnection.query(`
                                select * from ${dbName}.34_userapp_institutional_wow_flashcards_master where institutional_wow_flashcards_id = ${get_dta[0].institutional_wow_flashcards_id}
                                `)
                                // console.log(values[0].wow_flashcards_thumb_nail_cloud_storage_file_id,'values[0].wow_flashcards_thumb_nail_cloud_storage_file_id')
                                const flag_date_check =await this.helper.isWithinOneWeek(res[i]?.wow_class_stream_event_datetime);
                                Object.defineProperties(res[i], {
                                    is_global: {
                                        value: 0,
                                        enumerable: true
                                    },
                                    institutional_wow_flashcards_id: {
                                        value: values[0].institutional_wow_flashcards_id,
                                        enumerable: true
                                    },
                                    wow_flashcards_name: {
                                        value: values[0].wow_flashcards_name,
                                        enumerable: true
                                    },
                                    assigned_on_date_time: {
                                        value: res[i]?.wow_class_stream_event_datetime,
                                        enumerable: true
                                    },
                                    is_removed: {
                                        value: res[i]?.is_removed,
                                        enumerable: true
                                    },
                                    course_subject_user_category_allocation_id: {
                                        value: course_subject_user_category_allocation_id,
                                        enumerable: true
                                    },
                                    flag_new_date: {
                                        value: flag_date_check,
                                        enumerable: true
                                    },
                                    wow_flashcards_thumb_nail_cloud_storage_file_id: {
                                        value: values[0].wow_flashcards_thumb_nail_cloud_storage_file_id,
                                        enumerable: true
                                    }
                                });
                                let inst_flashcards_question_count: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${values[0].institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                    inst_flashcards_question_count = await dbConnection.query(`
                                    select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${values[0].institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                `)
                                }
                                Object.defineProperty(res[i], 'inst_flashcards_question_count',{
                                    value: inst_flashcards_question_count,
                                    enumerable: true
                                })
                            }
                            else if (get_dta[0]?.is_institutional_flashcards == 0) {
                                // global 
                                const values = await dbConnection.query(`
                                    select * from global_wow_flashcards_db.global_wow_flashcards_master
                                    where global_wow_flashcards_id = ${mysql.escape(get_dta[0].global_wow_flashcards_id)}
                                `);
                                // console.log(values,get_dta[0].global_wow_flashcards_id,'values');
                                let wow_flashcards_thumb_nail_cloud_storage_file_id_values: any;
                                if (values[0]?.institutional_wow_flashcards_id != null) {
                                    const get_values = await dbConnection.query(`
                                select * from ${dbName}.34_userapp_institutional_wow_flashcards_master 
                                where institutional_wow_flashcards_id = ${values[0]?.institutional_wow_flashcards_id}
                                `);
                                    // console.log(get_values,'get_values')
                                    if (get_values.length > 0) {
                                        wow_flashcards_thumb_nail_cloud_storage_file_id_values = get_values[0]?.wow_flashcards_thumb_nail_cloud_storage_file_id
                                    }
                                }
                                let inst_flashcards_question_count: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${values[0].institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                    inst_flashcards_question_count = await dbConnection.query(`
                                    select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${values[0].institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                `)
                                }
                                Object.defineProperty(res[i], 'inst_flashcards_question_count',{
                                    value: inst_flashcards_question_count,
                                    enumerable: true
                                })
                                // console.log(wow_flashcards_thumb_nail_cloud_storage_file_id_values,'wow_flashcards_thumb_nail_cloud_storage_file_id_values')
                                const flag_date_check =await this.helper.isWithinOneWeek(res[i]?.wow_class_stream_event_datetime);
                                Object.defineProperties(res[i], {
                                    is_global: {
                                        value: 1,
                                        enumerable: true
                                    },
                                    global_wow_flashcards_id: {
                                        value: values[0].global_wow_flashcards_id,
                                        enumerable: true
                                    },
                                    institutional_wow_flashcards_id: {
                                        value: values[0].institutional_wow_flashcards_id,
                                        enumerable: true
                                    },
                                    wow_flashcards_name: {
                                        value: values[0].wow_flashcards_name,
                                        enumerable: true
                                    },
                                    assigned_on_date_time: {
                                        value: res[i]?.wow_class_stream_event_datetime,
                                        enumerable: true
                                    },
                                    is_removed: {
                                        value: res[i]?.is_removed,
                                        enumerable: true
                                    },
                                    flag_new_date: {
                                        value: flag_date_check,
                                        enumerable: true
                                    },
                                    wow_flashcards_thumb_nail_cloud_storage_file_id: {
                                        value: wow_flashcards_thumb_nail_cloud_storage_file_id_values,
                                        enumerable: true
                                    }
                                })
                            }
                            // console.log(res[i],'fd')
                        }
                        final_values.push(res)
                    }
                })
            }
            // console.log(final_values,'final_values')
            const check_and_remove = final_values[0]?.filter(element => element?.institutional_wow_flashcards_id  != null);
            return check_and_remove;
        } catch (error) {
            return error;
        }
    }
    // UpdateSelectedAllocationIdField
    async UpdateSelectedAllocationIdField(
        country_code,
        customer_id,
        user_id,
        time_zone_iana_string,
        course_subject_user_category_allocation_id,
        wow_class_stream_reference_id,
        is_removed
    ) {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            var serverLocalDateFormate = this._dateTimeService.getDateTime(time_zone_iana_string);
            // console.log(is_removed,'is_removed');
            if (is_removed == 0) {
                await dbConnection.query(`
                update ${dbName}.36_userapp_${course_subject_user_category_allocation_id}_course_user_cat_allocation_id_class_stream
                set is_removed = 1
                where wow_class_stream_reference_id = ${mysql.escape(wow_class_stream_reference_id)} and wow_class_stream_type = 4
                `);

                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_assign_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id
                    )values(
                        'Updated',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                    create table ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id
                    )values(
                        'Updated',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                }
            } else if (is_removed == 1) {
                await dbConnection.query(`
                update ${dbName}.36_userapp_${course_subject_user_category_allocation_id}_course_user_cat_allocation_id_class_stream
                set is_removed = 0
                where wow_class_stream_reference_id = ${mysql.escape(wow_class_stream_reference_id)} and wow_class_stream_type = 4
                `);

                // 34_audit_trail_for_assign_wow_flashcards 
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_assign_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id
                    )values(
                        'Updated',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                    create table ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_assign_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id
                    )values(
                        'Updated',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                }
            }
        } catch (error) {
            return error;
        }
    }
}
