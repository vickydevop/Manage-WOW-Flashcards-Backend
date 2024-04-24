import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import { CommonRelevantSyllabus } from 'src/common/services/comon-relevant-syllabus/common.service';
import { DateTimeService } from 'src/common/services/date-time/date-time.service';
import { HelperService } from 'src/common/services/helper/helper.service';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import * as mysql from 'mysql2';
@Injectable()
export class RecommendedWowFlashcardsFromOtherTeachingFacultyService {
    constructor(private helper: HelperService, private _cmn: CommonRelevantSyllabus, private _dateTimeService: DateTimeService) { }
    // GetAllRecommendedWowResourcesListBasedOnLoginId
    async GetAllRecommendedWowResourcesListBasedOnLoginId(
        country_code,
        customer_id,
        user_id
    ) {
        try {
            const recommended_flashcards_from_other_teaching_faculty = `${country_code}_${customer_id}_edu_customer_db.34_userapp_shared_flashcards_from_other_teaching_faculty`;
            const userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const global_wow_flashcards_master = `global_wow_flashcards_db.global_wow_flashcards_master`;
            let list_of_recommended: any[] = [];
            // console.log(user_id, 'login_user_id');
            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_shared_flashcards_from_other_teaching_faculty`) == 1) {
                await dbConnection.query(`select * from ${recommended_flashcards_from_other_teaching_faculty} where recommended_to_user_id=${user_id}`).then(async (list_of_recommended_list: any) => {
                    // console.log(list_of_recommended_list, 'list_of_recommended_list');
                    if (list_of_recommended_list.length > 0) {
                        for (let it_recommend = 0; it_recommend < list_of_recommended_list.length; it_recommend++) {
                            let { shared_datetime,
                                is_global_wow_flashcards,
                                global_wow_flashcards_id,
                                recommended_by_user_id
                            } = list_of_recommended_list[it_recommend];

                            // console.log(is_global_wow_flashcards);
                            if (is_global_wow_flashcards == false) {
                                let wow_flashcards_thumb_nail_cloud_storage_file_id: any;
                                let wow_flashcards_name: any;
                                let recommended_by_user_info: any;
                                await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${list_of_recommended_list[it_recommend].institutional_wow_flashcards_id}`).then((res: any) => {
                                    if (res.length > 0) {
                                        // console.log(res)
                                        wow_flashcards_thumb_nail_cloud_storage_file_id = res[0].wow_flashcards_thumb_nail_cloud_storage_file_id
                                        wow_flashcards_name = res[0].wow_flashcards_name
                                    }

                                })
                                await dbConnection.query(`SELECT * FROM ${country_code}_${customer_id}_edu_customer_db.user_profile where user_id=${recommended_by_user_id};`).then((user_info: any) => {
                                    // console.log(user_info, 'user_info');
                                    if (user_info.length > 0) {
                                        recommended_by_user_info = {
                                            first_name: user_info[0].first_name,
                                            last_name: user_info[0].last_name,
                                            user_id:user_info[0].user_id,
                                            country_code:country_code,
                                            customer_id:customer_id
                                        }
                                    }
                                })
                                list_of_recommended.push({
                                    ...list_of_recommended_list[it_recommend],
                                    wow_flashcards_thumb_nail_cloud_storage_file_id,
                                    wow_flashcards_name,
                                    recommended_by_user_info,
                                    is_global: is_global_wow_flashcards
                                })
                            }
                            //   console.log(list_of_recommended,'list_of_recommended')

                            if (is_global_wow_flashcards == true) {
                                let wow_flashcards_thumb_nail_cloud_storage_file_id: any;
                                let wow_flashcards_name: any;
                                let recommended_by_user_info: any;
                                let institutional_wow_flashcards_id: any;
                                // console.log(global_wow_flashcards_id, 'global_wow_flashcards_id')
                                if (await this.helper.tableExists(`global_wow_flashcards_db`, `global_wow_flashcards_master`) == 1) {
                                    await dbConnection.query(`select * from ${global_wow_flashcards_master} where global_wow_flashcards_id=${global_wow_flashcards_id}`).then(async (res: any) => {
                                        // console.log(list_of_recommended_list[it_recommend], 'list_of_recommended_list')
                                        if (res.length > 0) {
                                            institutional_wow_flashcards_id = res[0].institutional_wow_flashcards_id;
                                            // console.log('resssssssssssss', res)
                                            wow_flashcards_name = res[0].wow_flashcards_name
                                            await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${res[0].institutional_wow_flashcards_id}`).then((res_1: any) => {
                                                // console.log('ress1111111111111', res_1)
                                                if (res_1.length > 0) {
                                                    wow_flashcards_thumb_nail_cloud_storage_file_id = res_1[0]?.wow_flashcards_thumb_nail_cloud_storage_file_id
                                                }

                                            })
                                        }
                                    })
                                }
                                await dbConnection.query(`SELECT * FROM ${country_code}_${customer_id}_edu_customer_db.user_profile where user_id=${recommended_by_user_id};`).then((user_info: any) => {
                                    // console.log(user_info, 'user_info');
                                    if (user_info.length > 0) {
                                        recommended_by_user_info = {
                                            first_name: user_info[0].first_name,
                                            last_name: user_info[0].last_name,
                                            user_id:user_info[0].user_id,
                                            country_code:country_code,
                                            customer_id:customer_id
                                        }
                                    }
                                })
                                let inst_flashcards_question_count: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                    inst_flashcards_question_count = await dbConnection.query(`
                                    select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                `)
                                }
                                const flag_date_check =await this.helper.isWithinOneWeek(shared_datetime);
                                list_of_recommended.push({
                                    flag_new_date : flag_date_check,
                                    shared_datetime,
                                    institutional_wow_flashcards_id,
                                    global_wow_flashcards_id,
                                    wow_flashcards_thumb_nail_cloud_storage_file_id,
                                    wow_flashcards_name,
                                    recommended_by_user_info,
                                    is_global: is_global_wow_flashcards,
                                    inst_flashcards_question_count
                                })
                            }

                        }

                    }
                })
            }
            return list_of_recommended;
        } catch (error) {
            return error;
        }
    }
    // GetAllCourseSubjectsBasedOnWowFlashcardsId
    async GetAllCourseSubjectsBasedOnWowFlashcardsId(
        country_code,
        customer_id,
        institutional_wow_flashcards_id
    ) {
        try {
            // log('log', institutional_wow_flashcards_id)
            let final_results: any[] = []
            const institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            const default_global_subjects_courses_for_educational_Inst_categories = `edu_user_apps_common_data_db.default_global_subjects_courses_for_educational_Inst_categories`;
            const userapp_institutional_study_subjects_courses = `${country_code}_${customer_id}_edu_customer_db.30_userapp_institutional_study_subjects_courses`;
            const educational_institutions_categories = `edu_user_app_db.educational_institutions_categories`;
            let global_registered_wow_customers_master_data = `global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data`
            let wth_dub_local_course_ids: any[] = [], wth_dub_global_course_ids: any[] = [];
            let wth_out_dub_local_course_ids: any[] = [], wth_out_dub_global_course_ids: any[] = [];
            await dbConnection.query(`select * from ${institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 0`).then((res: any) => {
                if (res.length > 0) wth_dub_local_course_ids.push(...res?.map(item => ({ course_subject_id: item.course_subject_id, educational_institution_category_id: item.educational_institution_category_id, educational_institution_category_country_code: item.educational_institution_category_country_code })));
            })

            await dbConnection.query(`select * from ${institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 1`).then((res: any) => {
                if (res.length > 0) wth_dub_global_course_ids.push(...res?.map(item => ({ course_subject_id: item.course_subject_id, educational_institution_category_id: item.educational_institution_category_id, educational_institution_category_country_code: item.educational_institution_category_country_code })));
            })


            function removeDuplicates(arr) {
                return arr.filter((obj, index) => {
                    // Check if the current object's index is the first occurrence
                    return (
                        index ===
                        arr.findIndex((o) => {
                            return JSON.stringify(o) === JSON.stringify(obj);
                        })
                    );
                });
            }
            wth_out_dub_local_course_ids = [...removeDuplicates(wth_dub_local_course_ids)]
            wth_out_dub_global_course_ids = [...removeDuplicates(wth_dub_global_course_ids)]
            for (let i = 0; i < wth_out_dub_local_course_ids.length; i++) {
                let { course_subject_id, educational_institution_category_id, educational_institution_category_country_code } = wth_out_dub_local_course_ids[i];
                let userapp_institutional_study_subjects_courses_details = `${country_code}_${customer_id}_edu_customer_db.30_userapp_institutional_study_subjects_courses_details`;
                let userapp_institutional_study_subjects_courses = `${country_code}_${customer_id}_edu_customer_db.30_userapp_institutional_study_subjects_courses`

                await dbConnection.query(` 
            select * from ${userapp_institutional_study_subjects_courses_details} where institutional_course_subject_id=${course_subject_id}
            order by effective_from_datetime desc limit 1
              `).then(async (res: any) => {
                    if (res.length > 0) {
                        const internalEducationalInstitutionName = await dbConnection.query(`select  * from ${global_registered_wow_customers_master_data} where customer_id = ${customer_id}`);
                        // const internalEducationalInstitutionName = await dbConnection.query(`
                        // select educational_institution_category_name from
                        // edu_user_app_db.educational_institutions_categories
                        // where country_code =${mysql.escape(educational_institution_category_country_code)} 
                        // and educational_institution_category_id = ${mysql.escape(educational_institution_category_id)}`);

                        // const descriptor = Object.getOwnPropertyDescriptor(res[0], 'country_code_of_user_id');
                        // Reflect.defineProperty(res[0], 'educational_institutional_category_country_code', descriptor);
                        // Reflect.deleteProperty(res[0], 'country_code_of_user_id');
                        // final_results.push(Object.assign(res[0], internalEducationalInstitutionName[0], { is_global: 0 }))
                        // console.log(res[0], 'ressssss');
                        final_results.push({
                            institutional_course_subject_id: course_subject_id,
                            course_subject_type: res[0].course_subject_type,
                            course_subject_name: res[0].course_subject_name,
                            educational_institutional_category_country_code: res[0].educational_institutional_category_country_code,
                            educational_institution_category_id,
                            educational_institution_category_country_code,
                            registered_educational_institution_name: internalEducationalInstitutionName[0]?.registered_educational_institution_name,
                            is_global: 0
                        })
                        // console.log(internalEducationalInstitutionName, 'internalEducationalInstitutionName')
                    }
                })
            }

            // Cannot destructure property 'course_subject_id' of 'wth_out_dub_local_course_ids[i]' as it is undefined
            // console.log(wth_out_dub_global_course_ids)
            for (let i = 0; i < wth_out_dub_global_course_ids.length; i++) {
                // console.log(wth_out_dub_global_course_ids[i], 'global')
                let { course_subject_id, educational_institution_category_id, educational_institution_category_country_code } = wth_out_dub_global_course_ids[i];
                // console.log(course_subject_id)
                // console.log('global', course_subject_id)

                const globalEducationalInstitutionName = await dbConnection.query(` select * from ${educational_institutions_categories} where 
                                            country_code =${mysql.escape(educational_institution_category_country_code)} and educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} limit 1
                                  `);

                await dbConnection.query(`select * from 
                       ${default_global_subjects_courses_for_educational_Inst_categories} where global_course_subject_id=${course_subject_id}
                       and educational_institutional_category_country_code=${mysql.escape(educational_institution_category_country_code)}
                       and educational_institutional_category_id=${mysql.escape(educational_institution_category_id)}
                       and last_update_datetime < CURRENT_TIMESTAMP order by last_update_datetime desc limit 1
              `).then(async (res: any) => {
                    // console.log('s')
                    // const globalEducationalInstitutionName = await dbConnection.query(`select * from ${global_registered_wow_customers_master_data} where customer_id=${customer_id}`);
                    let global_wow_flashcards_id: any = null;
                    let global_course_subject_id_wow_flashcards = `global_wow_flashcards_db.${course_subject_id}_global_course_subject_id_wow_flashcards`;
                    let global_wow_flashcards_master = `global_wow_flashcards_db.global_wow_flashcards_master`;
                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `global_wow_flashcards_master`) == 1) {
                        await dbConnection.query(`select * from ${global_wow_flashcards_master} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id} and institutional_flashcards_db_entry_creator_customer_country_code=${mysql.escape(country_code)}  and
                        institutional_flashcards_db_entry_creator_customer_id  = ${customer_id}`).then(async (res: any) => {
                            if (res.length > 0) {
                                if (await this.helper.tableExists(`global_wow_flashcards_db`, `${course_subject_id}_global_course_subject_id_wow_flashcards`) == 1) {
                                    for (let i = 0; i < res.length; i++) {
                                        await dbConnection.query(`select * from ${global_course_subject_id_wow_flashcards} where global_wow_flashcards_id=${res[i].global_wow_flashcards_id}`).then((res_1: any) => {
                                            // console.log('res_1', res_1)
                                            if (res_1.length > 0) {
                                                global_wow_flashcards_id = res[i].global_wow_flashcards_id
                                            }
                                        })
                                    }
                                }
                            }
                        })

                    }


                    // console.log(global_wow_flashcards_id, 'global_wow_flashcards_id')
                    // console.log(globalEducationalInstitutionName, 'globalEducationalInstitutionName')
                    // console.log(res, 'globval        res')

                    final_results.push({
                        global_course_subject_id: course_subject_id,
                        course_subject_type: res[0]?.course_subject_type,
                        course_subject_name: res[0]?.course_subject_name,
                        educational_institution_category_id,
                        educational_institution_category_country_code,
                        registered_educational_institution_name: globalEducationalInstitutionName[0]?.educational_institution_category_name,
                        is_global: 1,
                        global_wow_flashcards_id
                    })

                    // const descriptor = Object.getOwnPropertyDescriptor(globalEducationalInstitutionName[0], 'registered_educational_institution_name');
                    // console.log(globalEducationalInstitutionName)
                    // Reflect.deleteProperty(globalEducationalInstitutionName[0], 'registered_educational_institution_name');
                    // Reflect.defineProperty(globalEducationalInstitutionName[0], 'educational_institution_category_name', descriptor);
                    // final_results.push(Object.assign(res[0], globalEducationalInstitutionName[0], { is_global: 1, global_resource_id }))
                })
                // console.log(final_results, 'final_results')


            }
            return final_results;

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // GetSyllabusIdBasedOnSubjectIdAndFlashcardsId
    async GetSyllabusIdBasedOnSubjectIdAndFlashcardsId(
        customer_id,
        country_code,
        user_id,
        data) {
        try {
            // console.log(data, 'get_tree_view_data');
            let {
                is_global,
                institutional_course_subject_id,
                global_course_subject_id,
                institutional_wow_flashcards_id,
                educational_institution_category_country_code,
                educational_institution_category_id
            } = data;

            let course_subject_id: any;
            if (is_global == 0) {
              course_subject_id = institutional_course_subject_id
            } else if (is_global == 1) {
              course_subject_id = global_course_subject_id
            }
            // console.log(course_subject_id,'course_subject_id')
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;

            let get_syllabus_ids: any = [];
            if (await this.helper.tableExists(`${dbName} `, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
              const  get_syllabus_details = await dbConnection.query(`
                    SELECT * FROM ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage 
                    where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and 
                    course_subject_id = ${mysql.escape(course_subject_id)} and is_global = ${mysql.escape(is_global)} and 
                    educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} and
                    educational_institution_category_id = ${mysql.escape(educational_institution_category_id)}
                  `);

                  
                //   console.log(get_syllabus_details,'ds');
                  for(let i=0; i<get_syllabus_details.length; i++){
                      get_syllabus_ids.push(
                         get_syllabus_details[i].syllabus_id
                    );
                  }
                //   console.log(get_syllabus_ids,'s');
            }
            return get_syllabus_ids;
        } catch (error) {
            return error;
        }
    }
}
