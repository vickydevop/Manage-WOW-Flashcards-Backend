import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import { HelperService } from 'src/common/services/helper/helper.service';
import * as mysql from 'mysql2';
import { from } from 'rxjs';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
import { DateTimeService } from 'src/common/services/date-time/date-time.service';
import { CommonRelevantSyllabus } from 'src/common/services/comon-relevant-syllabus/common.service';
@Injectable()
export class YourWowFlashcardsService {

    constructor(private helper: HelperService, private _dateTimeService: DateTimeService, private CommonService: CommonRelevantSyllabus) { }
    // CheckAndCreateAllTables
    async CheckAndCreateAllTables(
        customer_id,
        country_code,
        user_id
    ) {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // 34_userapp_institutional_wow_flashcards_master 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
            } else {
                await dbConnection.query(`
                    create table ${dbName}.34_userapp_institutional_wow_flashcards_master(
                    flashcards_edited_datetime datetime, 
                    institutional_wow_flashcards_id int not null auto_increment primary key, 
                    global_wow_flashcards_id int,	 
                    wow_flashcards_name	varchar(255),	 
                    flashcards_entry_creator_user_id int,	 
                    flashcards_upload_datetime datetime,
                    wow_flashcards_description longtext,	 
                    wow_flashcards_thumb_nail_cloud_storage_file_id varchar(255),	 
                    is_hidden boolean
                    )
                    `);
            }
            // 34_userapp_institutional_wow_flashcards_collaborators 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
            } else {
                await dbConnection.query(`create table ${dbName}.34_userapp_institutional_wow_flashcards_collaborators(
                    institutional_wow_flashcards_id int,
                    collaborator_user_id int
                )`);
            }
            // 34_userapp_institutional_wow_flashcards_other_linkages 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_other_linkages`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_institutional_wow_flashcards_other_linkages(
                    institutional_wow_flashcards_id	int,
                    linked_global_wow_type int,
                    linked_global_wow_id int
                )
                `);
            }
            // 34_userapp_institutional_wow_flashcards_global_syllabus_linkage 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage(
                    institutional_wow_flashcards_id	int,
                    course_subject_id int,
                    is_global boolean,
                    educational_institution_category_country_code varchar(3),
                    educational_institution_category_id	varchar(100),
                    syllabus_id	varchar(50),
                    is_shared_globally boolean
                )
                `);
            }
            // 34_userapp_shared_flashcards_from_other_teaching_faculty
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_shared_flashcards_from_other_teaching_faculty`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_shared_flashcards_from_other_teaching_faculty(
                    recommended_to_user_id int,
                    shared_datetime	datetime,
                    is_global_wow_flashcards boolean,
                    institutional_wow_flashcards_id int,
                    global_wow_flashcards_id int,
                    recommended_by_user_id int
                )
                `)
            }
            // 34_userapp_wow_flashcards_monetization_prices 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_wow_flashcards_monetization_prices`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_wow_flashcards_monetization_prices(
                effective_from_datetime	datetime,
                institutional_wow_flashcards_id	int,
                is_monetized_globally boolean,
                is_monetized_for_the_institution boolean,
                one_time_subscription_cost_per_user_for_institutional_users	decimal(7,2),
                one_time_subscription_institutional_users_currency varchar(3),
                one_time_subscription_cost_per_user_for_global_users decimal(7,2),
                one_time_subscription_global_users_currency	varchar(3),
                entry_by_user_id int
                )
                `);
            }
            // 34_userapp_institutional_wow_flashcards_wise_earnings
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_wise_earnings`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_institutional_wow_flashcards_wise_earnings(
                    earning_transaction_id int not null auto_increment primary key,
                    earning_datetime datetime,
                    institutional_wow_flashcards_id int,
                    flashcards_collaborator_creator_user_id	int,
                    total_amount_charged_to_the_payer decimal(7,2),
                    amount_charged_currency	varchar(3),
                    shared_split_earning_amount	decimal(7,2),
                    earning_currency varchar(3),
                    paid_for_user_id int,
                    paid_by_user_id	int,
                    payment_type int,
                    payment_type_transaction_ref_id	int,
                    paid_by_customer_id	int,
                    paid_by_country_code_of_customer_id	varchar(3)
                    )
                `)
            }
            // 34_userapp_wow_flashcards_earnings_distribution_details 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_wow_flashcards_earnings_distribution_details`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_wow_flashcards_earnings_distribution_details(
                earning_transaction_id int,
                earning_distributed_to_user_id int,
                credit_to_users_earnings_wallet_transaction_id int,
                distribution_amount	decimal(7,2),
                distribution_currency varchar(3)
                )
                `)
            }
            // 34_userapp_payment_status_of_wow_flashcards_app_users 
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_payment_status_of_wow_flashcards_app_users`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_userapp_payment_status_of_wow_flashcards_app_users(
                    shared_datetime datetime,
                    is_global_wow_flashcards boolean,
                    institutional_wow_flashcards_id int,
                    global_wow_flashcards_id int,
                    paid_for_user_id int,
                    payment_type int,
                    payment_type_transaction_ref_id int,
                    paid_by_user_id	int
                )
                `)
            }
            // global_wow_flashcards_master
            if (await this.helper.tableExists(`global_wow_flashcards_db`, `global_wow_flashcards_master`) == 1) { }
            else {
                await dbConnection.query(`
                create table global_wow_flashcards_db.global_wow_flashcards_master (
                    global_wow_flashcards_id int not null auto_increment primary key,
                    globalized_datetime datetime,
                    institutional_flashcards_db_entry_creator_customer_country_code varchar(3),
                    institutional_flashcards_db_entry_creator_customer_id integer,
                    institutional_flashcards_db_entry_creator_user_id integer,
                    institutional_wow_flashcards_id integer,
                    wow_flashcards_name varchar(255),
                    one_time_subscription_cost_per_user_for_global_users decimal(7,2),
                    one_time_subscription_global_users_currency varchar(3),
                    up_to_date_total_no_global_users_to_whom_this_is_assigned integer,
                    avg_global_teaching_faculty_rating decimal(3,2)
                    )
                `)
            }
            // 34_audit_trail_for_your_wow_flashcards 
            if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
            } else {
                await dbConnection.query(`
              create table ${dbName}.34_audit_trail_for_your_wow_flashcards(
               id int not null auto_increment primary key,
               entry_type varchar(50),
               entry_date_time datetime,
               entry_by_user_id int,
               global_wow_flashcards_id int,
               institutional_wow_flashcards_id int
              )
              `)
            }
            // 34_audit_trail_for_global_wow_flashcards
            if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
            } else {
                await dbConnection.query(`
                create table ${dbName}.34_audit_trail_for_global_wow_flashcards(
                 id int not null auto_increment primary key,
                 entry_type varchar(50),
                 entry_date_time datetime,
                 entry_by_user_id int,
                 global_wow_flashcards_id int,
                 institutional_wow_flashcards_id int
                )
                `);
            }
            // 34_audit_trail_for_assign_wow_flashcards 
            if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_assign_wow_flashcards`) == 1) {
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
            }
            // 34_audit_trail_for_monetization_flashcards 
            if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
            } else {
                await dbConnection.query(`
            create table ${dbName}.34_audit_trail_for_monetization_flashcards(
             id int not null auto_increment primary key,
             entry_type varchar(50),
             entry_date_time datetime,
             entry_by_user_id int,
             global_wow_flashcards_id int,
             institutional_wow_flashcards_id int
            )
            `)
            }
        } catch (error) {
            return error;
        }
    }
    // GetAllRelevantSyllabusOfYourInterestFrom 
    async GetAllRelevantSyllabusOfYourInterestFrom(customer_id,
        country_code,
        user_id) {
        try {
            let institution_study_courses: any[] = []
            let institution: any[] = [];
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // console.log(dbName, 'dbName');
            const userapp_schedule_wise_teaching_faculty_and_location = `${dbName}.35_userapp_schedule_wise_teaching_faculty_and_location`;
            const userapp_student_user_category_wise_assigned_courses_subjects = `${dbName}.30_userapp_student_user_category_wise_assigned_courses_subjects`;
            const userapp_institutional_study_subjects_courses = `${dbName}.30_userapp_institutional_study_subjects_courses`;
            const userapp_institutional_study_subjects_courses_details = `${dbName}.30_userapp_institutional_study_subjects_courses_details`;
            const educational_institutions_categories = `edu_user_app_db.educational_institutions_categories`;
            const default_global_subjects_courses_for_educational_Inst_categories = `edu_user_apps_common_data_db.default_global_subjects_courses_for_educational_Inst_categories`;
            const global_registered_wow_customers_master_data = 'global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data';
            const userapp_user_category_wise_academic_year_terms_semesters = `${dbName}.30_userapp_user_category_wise_academic_year_terms_semesters`;
            const global_course_subject_of_interest = `${dbName}.${user_id}_user_id_global_course_subject_of_interest`;


            await dbConnection.query(`select 
                  distinct(tbl1.course_subject_user_category_allocation_id),
                  tbl2.user_category_id,
                  tbl2.term_semester_id,
                  tbl2.institutional_course_subject_id,
                  tbl2.for_academic_year_start,
                  tbl3.global_course_subject_id,
                  tbl3.educational_institution_category_id,
                  tbl3.educational_institution_category_country_code,
                  tbl3.your_institutional_reference_id,
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
                              select  json_object(
                                'educational_institution_category_name',registered_educational_institution_name)
                                 from ${global_registered_wow_customers_master_data} where customer_id=${customer_id}
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
              
              `).then(async (res: any) => {
                let is_subject_type_is_prefix: any;
                const userapp_default_suffix = `${country_code}_${customer_id}_edu_customer_db.30_userapp_default_suffix`
                await dbConnection.query(`select * from ${userapp_default_suffix}`).then((res: any) => {
                    if (res.length > 0) {
                        if (res[0].is_course_subject_type_the_default_suffix == true) {
                            is_subject_type_is_prefix = true
                        } else {
                            is_subject_type_is_prefix = false
                        }
                    }
                })
                for (let i = 0; i < res.length; i++) {
                    let { is_global, course_info, institution_info, global_course_subject_id } = res[i]?.sub_course_info
                    // console.log(is_global,course_info,institution_info)
                    // console.log(course_info)
                    // console.log(res[i].global_course_subject_id)
                    // console.log(res[i].educational_institution_category_id)
                    // console.log(res[i].educational_institution_category_country_code)
                    Object.defineProperties(res[i], {
                        is_global: { value: is_global, enumerable: true },
                        course_subject_name: { value: course_info != null ? course_info!.course_subject_name : null, enumerable: true },
                        course_subject_type: { value: course_info != null ? course_info!.course_subject_type : null, enumerable: true },
                        educational_institution_category_name: { value: institution_info?.educational_institution_category_name, enumerable: true },
                        // is_subject_type_is_prefix:{value:is_subject_type_is_prefix,enumerable:true}
                    })
                    if (is_global == false) {
                        Reflect.defineProperty(res[i], 'is_subject_type_is_prefix', { value: is_subject_type_is_prefix, enumerable: true })
                    }
                    Reflect.deleteProperty(res[i], 'sub_course_info')
                }
                institution_study_courses = res
            })
            let prop_val = (tbl, prop) => tbl.length > 0 ? tbl[0][prop] : null;
            if (await this.helper.tableExists(`${dbName}`, `${user_id}_user_id_global_course_subject_of_interest`) == 1) {
                // console.log('1')
                await dbConnection.query(`select * from ${global_course_subject_of_interest}`).then(async (res: any) => {
                    for (let i = 0; i < res.length; i++) {
                        let { global_course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = res[i];
                        const global_course_info = await dbConnection.query(`
                    select * from ${default_global_subjects_courses_for_educational_Inst_categories} where 
                    global_course_subject_id=${mysql.escape(global_course_subject_id)}
                    and educational_institutional_category_country_code=${mysql.escape(educational_institution_category_country_code)}
                    and educational_institutional_category_id=${mysql.escape(educational_institution_category_id)}
                    and last_update_datetime < CURRENT_TIMESTAMP order by last_update_datetime desc limit 1
                `);
                        const education_institution_info = await dbConnection.query(`select *from ${educational_institutions_categories} where 
                         country_code =${mysql.escape(educational_institution_category_country_code)} and educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} limit 1`)
                        //   console.log(res[i], 'education_institution_info');
                        institution.push({
                            ...res[i],
                            educational_institution_category_name: prop_val(education_institution_info, 'educational_institution_category_name'),
                            course_subject_name: prop_val(global_course_info, 'course_subject_name'),
                            course_subject_type: prop_val(global_course_info, 'course_subject_type'),
                            is_global: 1
                        });
                    }
                })
            }
            let flr_from_institution_study_courses = (key) => {
                // console.log(key,'ke')
                let { global_course_subject_id, educational_institution_category_id, educational_institution_category_country_code } = key
                return institution_study_courses.filter((item: any) => {
                    if (item.is_global == true &&
                        item.global_course_subject_id == global_course_subject_id &&
                        item.educational_institution_category_id == educational_institution_category_id &&
                        item.educational_institution_category_country_code == educational_institution_category_country_code) {
                        return true
                    }
                })
            }
            let inst: any[] = []
            for (let i = 0; i < institution.length; i++) {
                if (flr_from_institution_study_courses(institution[i]).length == 0) {
                    inst.push(institution[i])
                }
            }

            // console.log(institution_study_courses, 'institution_study_courses')

            const joinedTwoArrays = [...institution_study_courses, ...inst]

            return joinedTwoArrays;
        } catch (error) {
            return error;
        }
    }
    // GetTreeViewBasedOnAboveSelectedId 
    async GetTreeViewBasedOnAboveSelectedId(
        customer_id,
        country_code,
        user_id,
        get_tree_view_data) {
        try {
            // console.log(get_tree_view_data, 'get_tree_view_data');
            let {
                is_global,
                institutional_course_subject_id,
                global_course_subject_id
            } = get_tree_view_data;
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let get_tree_syllabus_details: any;
            if (is_global == 0) {
                if (await this.helper.tableExists(`${dbName}`, `30_userapp_${institutional_course_subject_id}_institutional_course_subject_id_syllabus_details`) == 1) {
                    get_tree_syllabus_details = await dbConnection.query(`
                    SELECT * FROM ${dbName}.30_userapp_${institutional_course_subject_id}_institutional_course_subject_id_syllabus_details order by id
                  `);
                }

                let data;
                if (get_tree_syllabus_details.length > 1) {
                    data = await this.treeConstruct(get_tree_syllabus_details);
                    return data;
                }

                const obj = get_tree_syllabus_details[0];
                const pair = { children: [] };
                const objData = { ...obj, ...pair };
                if (obj !== undefined) {
                    return [objData];
                }
                return [];
            } else {
                if (await this.helper.tableExists(`edu_user_apps_common_data_db `, `${global_course_subject_id}_global_course_subject_id_syllabus_details`) == 1) {
                    get_tree_syllabus_details = await dbConnection.query(`
                    SELECT * FROM edu_user_apps_common_data_db.${global_course_subject_id}_global_course_subject_id_syllabus_details order by id
                  `);
                }

                let data;
                if (get_tree_syllabus_details.length > 1) {
                    data = await this.treeConstruct(get_tree_syllabus_details);
                    return data;
                }

                const obj = get_tree_syllabus_details[0];
                const pair = { children: [] };
                const objData = { ...obj, ...pair };
                if (obj !== undefined) {
                    return [objData];
                }
                return [];
            }
        } catch (error) {
            return error;
        }
    }
    // GetHiddenWOWFlashcardsOrUpdateHide
    async GetHiddenWOWFlashcardsOrUpdateHide(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        data
    ) {
        try {
            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // console.log(data.receive_data_from_parent,'receive_data_from_parent');
            let {
                is_global,
                global_course_subject_id,
                institutional_course_subject_id,
                educational_institution_category_country_code,
                educational_institution_category_id,
                is_get_or_update,
                institutional_wow_flashcards_id,
                is_hide_value
            } = data.receive_data_from_parent;
            // console.log(is_hide_value,'is_hide_value')
            let based_on_above_id_data: any = [];
            if (is_get_or_update == 0) {
                if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1 && await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                    // console.log(data, 'data');
                    let course_subject_id: any;
                    if (is_global == 1) {
                        course_subject_id = global_course_subject_id
                    } else if (is_global == 0) {
                        course_subject_id = institutional_course_subject_id
                    }
                    for (let i = 0; i < data?.selected_syllabus_id.length; i++) {
                        // console.log(data?.selected_syllabus_id[i],'data?.selected_syllabus_id[i]')
                        const values = await dbConnection.query(`
                        select * from ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage a
                        left join ${dbName}.34_userapp_institutional_wow_flashcards_master b 
                        on a.institutional_wow_flashcards_id = b.institutional_wow_flashcards_id
                        where a.course_subject_id = ${mysql.escape(course_subject_id)} and a.educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} 
                        and a.educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} and a.syllabus_id = '${data?.selected_syllabus_id[i]}'
                        `).then(async (res) => {
                            if (res.length > 0) {
                                for (let i = 0; i < res.length; i++) {
                                    if (res[i]?.global_wow_flashcards_id != null) {
                                        // console.log(res[0].global_wow_flashcards_id);
                                        if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[i].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments`) == 1) {
                                            const comments =
                                                await dbConnection.query(`
                                        select count(*) as count from global_wow_flashcards_db.${res[i].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments;
                                        `);
                                            Object.defineProperty(res[i], 'global_comments', {
                                                value: comments[0]?.count,
                                                enumerable: true
                                            })
                                        }
                                    }
                                    let get_collaborator_user_id: any;
                                    if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
                                        get_collaborator_user_id = await dbConnection.query(`
                                        select * from ${dbName}.34_userapp_institutional_wow_flashcards_collaborators
                                        where institutional_wow_flashcards_id = ${res[i]?.institutional_wow_flashcards_id}
                                        `)
                                    }
                                    let inst_flashcards_question_count: any;
                                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${res[i]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                        inst_flashcards_question_count = await dbConnection.query(`
                                        select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${res[i]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                    `)
                                    }
                                    Object.defineProperty(res[i], 'inst_flashcards_question_count',{
                                        value: inst_flashcards_question_count,
                                        enumerable: true
                                    })
                                    if (get_collaborator_user_id.length > 0) {
                                        if (await this.helper.tableExists(`${dbName}`, `user_profile`) == 1) {
                                            let collaborated_with: any = [];
                                            for (let j = 0; j < get_collaborator_user_id.length; j++) {
                                                const collaborated_with_values = await dbConnection.query(`
                                             select * from ${dbName}.user_profile where user_id = ${get_collaborator_user_id[j]?.collaborator_user_id}
                                             `);

                                                collaborated_with.push(collaborated_with_values)
                                            }
                                            Object.defineProperty(res[i], 'collaborated_with', {
                                                value: collaborated_with[0],
                                                enumerable: true
                                            })
                                            //  console.log(collaborated_with,'collaborated_with');
                                            //  console.log(res[0],'collaborated_witeqeqeeqh');
                                        }
                                    }

                                    let flagged_message_count: any;
                                    let resolved_flag_count: any;
                                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[i].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                                        flagged_message_count = await dbConnection.query(`
                                     select count(*) as count from global_wow_flashcards_db.${res[i].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages;
                                     `);
                                        resolved_flag_count = await dbConnection.query(`
                                     select count(*) as count from global_wow_flashcards_db.${res[i].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages where resolved_by_user_id is not null;
                                     `);

                                        Object.defineProperties(res[i], {
                                            no_of_total_flags: {
                                                value: flagged_message_count[0]?.count,
                                                enumerable: true
                                            },
                                            no_of_resolved_flags: {
                                                value: resolved_flag_count[0]?.count,
                                                enumerable: true
                                            }
                                        }
                                        )
                                    }

                                    based_on_above_id_data.push(res[i]);
                                }
                            }
                        })
                        // console.log(based_on_above_id_data,'based');

                    }

                }
            } else if (is_get_or_update == 1) {
                await dbConnection.query(`
                update ${dbName}.34_userapp_institutional_wow_flashcards_master 
                set is_hidden = ${mysql.escape(is_hide_value)} 
                where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                `);

                // 34_audit_trail_for_your_wow_flashcards 
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                     entry_type,
                     entry_date_time,
                     entry_by_user_id,
                     institutional_wow_flashcards_id
                     )values(
                      'Updated',
                      ${mysql.escape(serverLocalDateFormate)},
                      ${mysql.escape(user_id)},
                      ${mysql.escape(institutional_wow_flashcards_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                  create table ${dbName}.34_audit_trail_for_your_wow_flashcards(
                   id int not null auto_increment primary key,
                   entry_type varchar(50),
                   entry_date_time datetime,
                   entry_by_user_id int,
                   global_wow_flashcards_id int,
                   institutional_wow_flashcards_id int
                  )
                  `)
                    await dbConnection.query(`
                  insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                   entry_type,
                   entry_date_time,
                   entry_by_user_id,
                   institutional_wow_flashcards_id
                   )values(
                    'Updated',
                    ${mysql.escape(serverLocalDateFormate)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(institutional_wow_flashcards_id)}
                  )
                  `)
                }
            }
            const uniqueData = [];
            const seenIds = new Set();
            based_on_above_id_data.forEach(item => {
                const flashcardsId = item.institutional_wow_flashcards_id;

                if (!seenIds.has(flashcardsId)) {
                    seenIds.add(flashcardsId);
                    uniqueData.push(item);
                }
            });
            return uniqueData;
        } catch (error) {
            return error;
        }
    }
    // GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId
    async GetTableDataBasedOnAboveSelectedRelevantSyllabusAndSyllabusId(
        customer_id,
        country_code,
        user_id,
        data
    ) {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let based_on_above_id_data: any = [];

            // if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1 && await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_master`) == 1) {

            // }


            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1 && await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                // console.log(data, 'data');
                let {
                    is_global,
                    global_course_subject_id,
                    institutional_course_subject_id,
                    educational_institution_category_country_code,
                    educational_institution_category_id
                } = data.receive_data_from_parent;

                let course_subject_id: any;
                if (is_global == 1) {
                    course_subject_id = global_course_subject_id
                } else if (is_global == 0) {
                    course_subject_id = institutional_course_subject_id
                }
                for (let i = 0; i < data?.selected_syllabus_id.length; i++) {
                    // console.log(data?.selected_syllabus_id[i],'data?.selected_syllabus_id[i]')
                    const values = await dbConnection.query(`
                    select * from ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage a
                    left join ${dbName}.34_userapp_institutional_wow_flashcards_master b 
                    on a.institutional_wow_flashcards_id = b.institutional_wow_flashcards_id
                    where a.course_subject_id = ${mysql.escape(course_subject_id)} and b.flashcards_entry_creator_user_id =${mysql.escape(user_id)} and b.is_hidden = 0 and a.educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} 
                    and a.educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} and a.syllabus_id = '${data?.selected_syllabus_id[i]}'
                    `).then(async (res) => {
                        if (res.length > 0) {
                            console.log(res.length, 'if');
                            for (let k = 0; k < res.length; k++) {
                                if (res[k]?.global_wow_flashcards_id != null) {
                                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments`) == 1) {
                                        const comments =
                                            await dbConnection.query(`
                                    select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments;
                                    `);
                                        Object.defineProperty(res[k], 'global_comments', {
                                            value: comments[0]?.count,
                                            enumerable: true
                                        })
                                    }
                                }
                                let get_collaborator_user_id: any;
                                if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
                                    get_collaborator_user_id = await dbConnection.query(`
                                    select * from ${dbName}.34_userapp_institutional_wow_flashcards_collaborators
                                    where institutional_wow_flashcards_id = ${res[k]?.institutional_wow_flashcards_id}
                                    `)
                                }
                                if (get_collaborator_user_id.length > 0) {
                                    if (await this.helper.tableExists(`${dbName}`, `user_profile`) == 1) {
                                        let collaborated_with: any = [];
                                        for (let j = 0; j < get_collaborator_user_id.length; j++) {
                                            const collaborated_with_values = await dbConnection.query(`
                                            select * from ${dbName}.user_profile where user_id = ${get_collaborator_user_id[j]?.collaborator_user_id}
                                            `);
                                            // console.log(collaborated_with_values,'get_collaborator_user_id')

                                            collaborated_with.push(collaborated_with_values[0])
                                        }
                                        Object.defineProperty(res[k], 'collaborated_with', {
                                            value: collaborated_with,
                                            enumerable: true
                                        })
                                        //  console.log(collaborated_with,'collaborated_with');
                                        //  console.log(res[0],'collaborated_witeqeqeeqh');
                                    }
                                }

                                let flagged_message_count: any;
                                let resolved_flag_count: any;
                                if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                                    flagged_message_count = await dbConnection.query(`
                                 select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages;
                                 `);
                                    resolved_flag_count = await dbConnection.query(`
                                 select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages where resolved_by_user_id is not null;
                                 `);

                                    Object.defineProperties(res[k], {
                                        no_of_total_flags: {
                                            value: flagged_message_count[0]?.count,
                                            enumerable: true
                                        },
                                        no_of_resolved_flags: {
                                            value: resolved_flag_count[0]?.count,
                                            enumerable: true
                                        }
                                    }
                                    )
                                }
                                const flag_date_check = this.helper.isWithinOneWeek(res[k]?.flashcards_edited_datetime);
                                Object.defineProperty(res[k], 'flag_new_date', {
                                    value: flag_date_check,
                                    enumerable: true
                                })
                                // console.log(res[k],'res[0000000000000000000000000000000000')
                                if (res[k]?.institutional_wow_flashcards_id != (null || undefined)) {
                                    based_on_above_id_data.push(res[k]);
                                }
                                let inst_flashcards_question_count: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${res[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                    inst_flashcards_question_count = await dbConnection.query(`
                                        select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${res[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                    `)
                                }
                                Object.defineProperty(res[k], 'inst_flashcards_question_count',{
                                    value: inst_flashcards_question_count,
                                    enumerable: true
                                })
                            }
                        } else {
                            console.log(res.length, user_id, 'else');
                            const values = await dbConnection.query(`
                            select * from ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage a
                            left join ${dbName}.34_userapp_institutional_wow_flashcards_master b 
                            on a.institutional_wow_flashcards_id = b.institutional_wow_flashcards_id
                            left join ${dbName}.34_userapp_institutional_wow_flashcards_collaborators c
                            on b.institutional_wow_flashcards_id = c.institutional_wow_flashcards_id
                            where a.course_subject_id = ${mysql.escape(course_subject_id)} and c.collaborator_user_id =${mysql.escape(user_id)} and b.is_hidden = 0 and a.educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} 
                            and a.educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} and a.syllabus_id = '${data?.selected_syllabus_id[i]}'
                            `).then(async (res) => {
                                console.log(res, 'res');
                                for (let k = 0; k < res.length; k++) {
                                    if (res[k]?.global_wow_flashcards_id != null) {
                                        if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments`) == 1) {
                                            const comments =
                                                await dbConnection.query(`
                                        select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments;
                                        `);
                                            Object.defineProperty(res[k], 'global_comments', {
                                                value: comments[0]?.count,
                                                enumerable: true
                                            })
                                        }
                                    }
                                    let get_collaborator_user_id: any;
                                    if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
                                        get_collaborator_user_id = await dbConnection.query(`
                                        select * from ${dbName}.34_userapp_institutional_wow_flashcards_collaborators
                                        where institutional_wow_flashcards_id = ${res[k]?.institutional_wow_flashcards_id}
                                        `)
                                    }
                                    if (get_collaborator_user_id.length > 0) {
                                        if (await this.helper.tableExists(`${dbName}`, `user_profile`) == 1) {
                                            let collaborated_with: any = [];
                                            for (let j = 0; j < get_collaborator_user_id.length; j++) {
                                                const collaborated_with_values = await dbConnection.query(`
                                                select * from ${dbName}.user_profile where user_id = ${get_collaborator_user_id[j]?.collaborator_user_id}
                                                `);
                                                // console.log(collaborated_with_values,'get_collaborator_user_id')

                                                collaborated_with.push(collaborated_with_values[0])
                                            }
                                            Object.defineProperty(res[k], 'collaborated_with', {
                                                value: collaborated_with,
                                                enumerable: true
                                            })
                                            //  console.log(collaborated_with,'collaborated_with');
                                            //  console.log(res[0],'collaborated_witeqeqeeqh');
                                        }
                                    }

                                    let flagged_message_count: any;
                                    let resolved_flag_count: any;
                                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                                        flagged_message_count = await dbConnection.query(`
                                     select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages;
                                     `);
                                        resolved_flag_count = await dbConnection.query(`
                                     select count(*) as count from global_wow_flashcards_db.${res[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages where resolved_by_user_id is not null;
                                     `);

                                        Object.defineProperties(res[k], {
                                            no_of_total_flags: {
                                                value: flagged_message_count[0]?.count,
                                                enumerable: true
                                            },
                                            no_of_resolved_flags: {
                                                value: resolved_flag_count[0]?.count,
                                                enumerable: true
                                            }
                                        }
                                        )
                                    }
                                    const flag_date_check = await this.helper.isWithinOneWeek(res[k]?.flashcards_edited_datetime);
                                    Object.defineProperty(res[k], 'flag_new_date', {
                                        value: flag_date_check,
                                        enumerable: true
                                    })
                                    // console.log(res[k],'res[0000000000000000000000000000000000')
                                    if (res[k]?.institutional_wow_flashcards_id != (null || undefined)) {
                                        based_on_above_id_data.push(res[k]);
                                    }
                                    let inst_flashcards_question_count: any;
                                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${res[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                        inst_flashcards_question_count = await dbConnection.query(`
                                        select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${res[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                    `)
                                    }
                                    Object.defineProperty(res[k], 'inst_flashcards_question_count',{
                                        value: inst_flashcards_question_count,
                                        enumerable: true
                                    })
                                }
                            })
                        }
                    })
                    // console.log(based_on_above_id_data,'based');

                }

            }

            const uniqueData = [];
            const seenIds = new Set();
            based_on_above_id_data.forEach(item => {
                const flashcardsId = item.institutional_wow_flashcards_id;

                if (!seenIds.has(flashcardsId)) {
                    seenIds.add(flashcardsId);
                    uniqueData.push(item);
                }
            });

            return uniqueData;
        } catch (error) {
            return error;
        }
    }
    // GetDataBasedOnGlobalWowFlashcardsResolvedFlags 
    async GetDataBasedOnGlobalWowFlashcardsResolvedFlags(
        customer_id,
        country_code,
        global_wow_flashcards_id
    ) {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let final_value: any = [];
            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                await dbConnection.query(`
                select * from global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages;
                `).then(async (res) => {
                    // console.log(res);
                    const values = await dbConnection.query(`
                    SELECT * FROM ${dbName}.user_profile where user_id=${res[0]?.resolved_by_user_id}`);

                    const values2 = await dbConnection.query(`
                    SELECT * FROM ${dbName}.user_profile where user_id=${res[0]?.flagged_by_user_id}`);

                    Object.defineProperties(res[0], {
                        resolved_by: {
                            value: values[0],
                            enumerable: true
                        },
                        flagged_by: {
                            value: values2[0],
                            enumerable: true
                        }
                    })
                    final_value.push(res[0])
                });
            }

            return final_value;
        } catch (error) {
            return error;
        }
    }
    // UpdateResolveFlag
    async UpdateResolveFlag(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        resolve_flag
    ) {
        try {
            let {
                global_wow_flashcards_id,
                flag_message_id,
                resolve_comment_value,
                current_datetime
            } = resolve_flag;
            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );
            // console.log(resolve_flag);
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                await dbConnection.query(`
              update global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages 
              set resolved_comments = ${mysql.escape(resolve_comment_value)},resolved_by_user_id = ${mysql.escape(user_id)},
              resolved_datetime = ${mysql.escape(current_datetime)} where flag_message_id =${mysql.escape(flag_message_id)};
              `);
                //   34_audit_trail_for_your_wow_flashcards
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                     entry_type,
                     entry_date_time,
                     entry_by_user_id,
                     global_wow_flashcards_id
                     )values(
                      'Updated',
                      ${mysql.escape(serverLocalDateFormate)},
                      ${mysql.escape(user_id)},
                      ${mysql.escape(global_wow_flashcards_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                  create table ${dbName}.34_audit_trail_for_your_wow_flashcards(
                   id int not null auto_increment primary key,
                   entry_type varchar(50),
                   entry_date_time datetime,
                   entry_by_user_id int,
                   global_wow_flashcards_id int,
                   institutional_wow_flashcards_id int
                  )
                  `)
                    await dbConnection.query(`
                  insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                   entry_type,
                   entry_date_time,
                   entry_by_user_id,
                   global_wow_flashcards_id
                   )values(
                    'Updated',
                    ${mysql.escape(serverLocalDateFormate)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(global_wow_flashcards_id)}
                  )
                  `)
                }
            }
        } catch (error) {
            return error;
        }
    }
    // GetRecommendTeachingFacultyUsers 
    async GetRecommendTeachingFacultyUsers(
        customer_id,
        country_code,
        user_id
    ) {
        try {
            let final_result: any[] = [];
            const edu_customer_db = `${country_code}_${customer_id}_edu_customer_db`;
            const userapp_user_category = `${edu_customer_db}.2_userapp_user_category`;
            const all_teaching_faculty_list = await dbConnection.query(`select user_category_id from ${userapp_user_category} where category_type = 0`);
            const all_category_list = await dbConnection.query(`select * from ${userapp_user_category}`);

            for (let i = 0; i < all_teaching_faculty_list.length; i++) {
                let result1 = all_teaching_faculty_list[i].user_category_id;
                let user_category_name: any[] = [];
                for (let i = 0; i < all_category_list.length; i++) {
                    let result = await dbConnection.query(`SELECT * FROM ${userapp_user_category} where user_category_id=${mysql.escape(result1)}`);
                    if (result.length > 0) {
                        result1 = result[0].parent_user_category_id;
                        user_category_name.push(result[0].user_category_name);
                    }
                }
                final_result.push({
                    user_category_name: user_category_name.reverse().toString().replace(/,/g, '/'),
                    user_category_id: all_teaching_faculty_list[i].user_category_id,
                });
            }
            return final_result;

        } catch (error) {
            return error;
        }
    }
    // GetRecommendTeachingRegisteredUsers
    async GetRecommendTeachingRegisteredUsers(
        customer_id,
        country_code,
        user_category_id,
        is_global_wow_flashcards,
        global_wow_flashcards_id,
        institutional_wow_flashcards_id
    ) {
        try {
            const edu_customer_db = `${country_code}_${customer_id}_edu_customer_db`;
            const user_profile = `${edu_customer_db}.user_profile`;
            const userapp_registered_users_registered_categories = `${edu_customer_db}.2_userapp_registered_users_registered_categories`;
            const userapp_user_category = `${edu_customer_db}.2_userapp_user_category`;

            const getCollaborators = await dbConnection.query(`
          SELECT a.* from ${user_profile} a left join 
          ${userapp_registered_users_registered_categories} b 
          on a.user_id = b.user_id
          where b.user_category_id =${mysql.escape(user_category_id)}
        `);

            const all_category_list = await dbConnection.query(`select * from ${userapp_user_category}`);
            const getData: any = [];
            for (let i = 0; i < getCollaborators.length; i++) {
                let { user_id } = getCollaborators[i]
                const all_category_based_on_user_id = await dbConnection.query(`SELECT * FROM ${userapp_registered_users_registered_categories} where user_id=${user_id}`);
                let all_categories: any[] = []
                for (let j = 0; j < all_category_based_on_user_id.length; j++) {
                    let { user_category_id } = all_category_based_on_user_id[j]
                    let result1 = user_category_id;
                    let AlldataforStudent: any[] = [];
                    for (let i = 0; i < all_category_list.length; i++) {
                        let result = await dbConnection.query(`SELECT * FROM ${userapp_user_category} where user_category_id=${mysql.escape(result1)}`);
                        if (result.length > 0) {
                            result1 = result[0].parent_user_category_id;
                            AlldataforStudent.push(result[0].user_category_name);
                        }
                    }
                    all_categories.push(AlldataforStudent.reverse().toString().replace(/,/g, '/'))
                }
                getData.push({ ...getCollaborators[i], category: all_categories });
            }
            let get_table_data: any;
            if(is_global_wow_flashcards == 1){
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_userapp_shared_flashcards_from_other_teaching_faculty`) == 1) {
                    const table_data =
                        await dbConnection.query(`
                    select * from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty where global_wow_flashcards_id =${mysql.escape(global_wow_flashcards_id)}
                    `);
    
                    get_table_data = table_data;
                }
            }else if(is_global_wow_flashcards == 0){
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_userapp_shared_flashcards_from_other_teaching_faculty`) == 1) {
                    const table_data =
                        await dbConnection.query(`
                    select * from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty where institutional_wow_flashcards_id=${mysql.escape(institutional_wow_flashcards_id)}
                    `);
    
                    get_table_data = table_data;
                }
            }
            return { getData, get_table_data };

        } catch (error) {
            return error;
        }
    }
    // InsertOrUpdateRecommendTeachingFacultyUsers 
    async InsertOrUpdateRecommendTeachingFacultyUsers(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        recommend
    ) {
        try {
            console.log(recommend, 're');
            let {
                recommended_to_user_id,
                shared_datetime,
                is_global_wow_flashcards,
                institutional_wow_flashcards_id,
                global_wow_flashcards_id
            } = recommend;
            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );
            const edu_customer_db = `${country_code}_${customer_id}_edu_customer_db`;
            if (await this.helper.tableExists(`${edu_customer_db}`, `34_userapp_shared_flashcards_from_other_teaching_faculty`) == 1) {
                const check =
                    await dbConnection.query(`
                select count(*) as count from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                where recommended_by_user_id = ${mysql.escape(user_id)}
                `);
                // if (check[0]?.count > 0) {
                //     await dbConnection.query(`
                //     delete from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                //     where recommended_by_user_id = ${mysql.escape(user_id)}
                //     `);
                // }
                if(is_global_wow_flashcards == 1){
                    for (let i = 0; i < recommended_to_user_id.length; i++) {
                        const check =
                            await dbConnection.query(`
                        select count(*) as count from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                        where recommended_to_user_id = ${mysql.escape(recommended_to_user_id[i])} and recommended_by_user_id = ${mysql.escape(user_id)}
                        and is_global_wow_flashcards=${mysql.escape(is_global_wow_flashcards)} and global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `);
    
                        // console.log(check[0]?.count);
                        if (check[0]?.count == 0) {
                            // console.log(recommended_to_user_id[i],'delete');
                            await dbConnection.query(`
                            insert into ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                            (
                            recommended_to_user_id,
                            shared_datetime,
                            is_global_wow_flashcards,
                            institutional_wow_flashcards_id,
                            global_wow_flashcards_id,
                            recommended_by_user_id
                            ) values (
                                ${mysql.escape(mysql.escape(recommended_to_user_id[i]))},
                                ${mysql.escape(shared_datetime)},
                                ${mysql.escape(is_global_wow_flashcards)},
                                ${mysql.escape(institutional_wow_flashcards_id)},
                                ${mysql.escape(global_wow_flashcards_id)},
                                ${mysql.escape(user_id)}
                            )
                            `);
    
                        }
                    }
                }else if(is_global_wow_flashcards == 0){
                    for (let i = 0; i < recommended_to_user_id.length; i++) {
                        const check =
                            await dbConnection.query(`
                        select count(*) as count from ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                        where recommended_to_user_id = ${mysql.escape(recommended_to_user_id[i])} and recommended_by_user_id = ${mysql.escape(user_id)}
                        and is_global_wow_flashcards=${mysql.escape(is_global_wow_flashcards)} and institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                        `);
    
                        // console.log(check[0]?.count);
                        if (check[0]?.count == 0) {
                            // console.log(recommended_to_user_id[i],'delete');
                            await dbConnection.query(`
                            insert into ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty 
                            (
                            recommended_to_user_id,
                            shared_datetime,
                            is_global_wow_flashcards,
                            institutional_wow_flashcards_id,
                            global_wow_flashcards_id,
                            recommended_by_user_id
                            ) values (
                                ${mysql.escape(mysql.escape(recommended_to_user_id[i]))},
                                ${mysql.escape(shared_datetime)},
                                ${mysql.escape(is_global_wow_flashcards)},
                                ${mysql.escape(institutional_wow_flashcards_id)},
                                ${mysql.escape(global_wow_flashcards_id)},
                                ${mysql.escape(user_id)}
                            )
                            `);
    
                        }
                    }
                }
                // 34_audit_trail_for_your_wow_flashcards 
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                     entry_type,
                     entry_date_time,
                     entry_by_user_id,
                     global_wow_flashcards_id,
                     institutional_wow_flashcards_id
                     )values(
                      'Inserted',
                      ${mysql.escape(serverLocalDateFormate)},
                      ${mysql.escape(user_id)},
                      ${mysql.escape(global_wow_flashcards_id)},
                      ${mysql.escape(institutional_wow_flashcards_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                  create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                   id int not null auto_increment primary key,
                   entry_type varchar(50),
                   entry_date_time datetime,
                   entry_by_user_id int,
                   global_wow_flashcards_id int,
                   institutional_wow_flashcards_id int
                  )
                  `)
                    await dbConnection.query(`
                  insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                   entry_type,
                   entry_date_time,
                   entry_by_user_id,
                   global_wow_flashcards_id,
                   institutional_wow_flashcards_id
                   )values(
                    'Inserted',
                    ${mysql.escape(serverLocalDateFormate)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(global_wow_flashcards_id)},
                    ${mysql.escape(institutional_wow_flashcards_id)}
                  )
                  `)
                }
            } else {
                await dbConnection.query(`
                create table ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty(
                    recommended_to_user_id int,
                    shared_datetime	datetime,
                    is_global_wow_flashcards boolean,
                    institutional_wow_flashcards_id int,
                    global_wow_flashcards_id int,
                    recommended_by_user_id int
                )
                `);
                for (let i = 0; i < recommended_to_user_id.length; i++) {
                    await dbConnection.query(`
                    insert into ${edu_customer_db}.34_userapp_shared_flashcards_from_other_teaching_faculty (
                        recommended_to_user_id,
                        shared_datetime,
                        is_global_wow_flashcards,
                        institutional_wow_flashcards_id,
                        global_wow_flashcards_id,
                        recommended_by_user_id  
                    ) values (
                        ${mysql.escape(recommended_to_user_id[i])},
                        ${mysql.escape(shared_datetime)},
                        ${mysql.escape(is_global_wow_flashcards)},
                        ${mysql.escape(institutional_wow_flashcards_id)},
                        ${mysql.escape(global_wow_flashcards_id)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                }
                // 34_audit_trail_for_your_wow_flashcards 
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                     entry_type,
                     entry_date_time,
                     entry_by_user_id,
                     global_wow_flashcards_id,
                     institutional_wow_flashcards_id
                     )values(
                      'Inserted',
                      ${mysql.escape(serverLocalDateFormate)},
                      ${mysql.escape(user_id)},
                      ${mysql.escape(global_wow_flashcards_id)},
                      ${mysql.escape(institutional_wow_flashcards_id)}
                    )
                    `)
                } else {
                    await dbConnection.query(`
                  create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                   id int not null auto_increment primary key,
                   entry_type varchar(50),
                   entry_date_time datetime,
                   entry_by_user_id int,
                   global_wow_flashcards_id int,
                   institutional_wow_flashcards_id int
                  )
                  `)
                    await dbConnection.query(`
                  insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                   entry_type,
                   entry_date_time,
                   entry_by_user_id,
                   global_wow_flashcards_id,
                   institutional_wow_flashcards_id
                   )values(
                    'Inserted',
                    ${mysql.escape(serverLocalDateFormate)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(global_wow_flashcards_id)},
                    ${mysql.escape(institutional_wow_flashcards_id)}
                  )
                  `)
                }
            }

        } catch (error) {
            return error;
        }
    }
    // List_of_Linked_Syllabus_BasedOn_Wow_flashcards
    async List_of_Linked_Syllabus_BasedOn_Wow_flashcards(customer_id, country_code, user_id, institutional_wow_flashcards_id) {
        try {
            let final_results: any[] = []
            const institutional_wow_flashcards_syllabus_linkage_tbl_name = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            const default_global_subjects_courses_for_educational_Inst_categories_tbl_name = `edu_user_apps_common_data_db.default_global_subjects_courses_for_educational_Inst_categories`;
            const institutional_study_subjects_courses_details = `${country_code}_${customer_id}_edu_customer_db.30_userapp_institutional_study_subjects_courses_details`;
            const global_registered_wow_customers_master_data = `global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data`;
            const educational_institutions_categories = `edu_user_app_db.educational_institutions_categories`;

            await dbConnection.query(`select * from ${institutional_wow_flashcards_syllabus_linkage_tbl_name} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id}`).then(async (fetch_wow_flashcards_syllabus_linkage: any) => {
                if (fetch_wow_flashcards_syllabus_linkage.length > 0) {
                    let duplicate_course_subject_id: any[] = []
                    // console.log(fetch_wow_flashcards_syllabus_linkage, 'fetch_wow_flashcards_syllabus_linkage');
                    for (let i = 0; i < fetch_wow_flashcards_syllabus_linkage.length; i++) {
                        let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = fetch_wow_flashcards_syllabus_linkage[i]
                        duplicate_course_subject_id.push({ course_subject_id, educational_institution_category_country_code, educational_institution_category_id })
                    }

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

                    let removed_duplicate_course_subject_id = [...removeDuplicates(duplicate_course_subject_id)];
                    // console.log(removed_duplicate_course_subject_id, 'removed_duplicate_course_subject_id')
                    let course_subject: any[] = [];

                    for (let i = 0; i < removed_duplicate_course_subject_id.length; i++) {
                        let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = removed_duplicate_course_subject_id[i]
                        await dbConnection.query(`
                          select * from ${institutional_wow_flashcards_syllabus_linkage_tbl_name} where 
                          institutional_wow_flashcards_id =${institutional_wow_flashcards_id} and 
                          course_subject_id=${course_subject_id} and 
                          is_global = 1 and
                          educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} and
                          educational_institution_category_id = ${mysql.escape(educational_institution_category_id)}
                          `).then((res_1: any) => {
                            if (res_1.length > 0) {
                                course_subject.push(res_1[0]);
                                // console.log(res_1, 'fuhskferkjrilejfkro');
                            }
                        })
                        await dbConnection.query(`
                        select * from ${institutional_wow_flashcards_syllabus_linkage_tbl_name} where 
                        institutional_wow_flashcards_id =${institutional_wow_flashcards_id} and 
                        course_subject_id=${course_subject_id} and 
                        is_global = 0 and
                        educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} and
                        educational_institution_category_id = ${mysql.escape(educational_institution_category_id)}

                     `).then((res_1: any) => {
                            if (res_1.length > 0) {
                                course_subject.push(res_1[0])
                            }
                        })
                    }
                    // console.log(course_subject, 'course_subject');
                    for (let i = 0; i < course_subject.length; i++) {
                        let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = course_subject[i]
                        let subject_ids: any[] = []
                        await dbConnection.query(`
                             select * from ${institutional_wow_flashcards_syllabus_linkage_tbl_name} where institutional_wow_flashcards_id =${institutional_wow_flashcards_id} and course_subject_id=${course_subject[i].course_subject_id} and is_global = ${course_subject[i].is_global}
                       `).then((res_1: any) => {
                            subject_ids = res_1.map(item => item.syllabus_id)
                        })
                        if (course_subject[i].is_global == true) {
                            // console.log('he')
                            // console.log(course_subject_id, educational_institution_category_country_code, educational_institution_category_id)
                            let global_data = async (res) => {
                                // console.log(res, 'resresres')
                                const globalEducationalInstitutionName = await dbConnection.query(` select * from ${educational_institutions_categories} where 
                                        country_code =${mysql.escape(educational_institution_category_country_code)} and educational_institution_category_id = ${mysql.escape(educational_institution_category_id)} limit 1
                              `);
                                //   console.log(globalEducationalInstitutionName,'globalEducationalInstitutionName');
                                // console.log(course_subject[i].course_subject_id,'course_subject[i].course_subject_id');
                                let global_flashcards_id: any = null;
                                let global_course_subject_id_wow_flashcards = `global_wow_flashcards_db.${course_subject[i].course_subject_id}_global_course_subject_id_wow_flashcards`;
                                let global_wow_flashcards_master = `global_wow_flashcards_db.global_wow_flashcards_master`;
                                if (await this.helper.tableExists(`global_wow_flashcards_db`, `global_wow_flashcards_master`) == 1) {
                                    // console.log('entry 1');
                                    await dbConnection.query(`select * from ${global_wow_flashcards_master} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id} and institutional_flashcards_db_entry_creator_customer_country_code=${mysql.escape(country_code)} and institutional_flashcards_db_entry_creator_user_id=${user_id} and institutional_flashcards_db_entry_creator_customer_id=${customer_id}`).then(async (res: any) => {
                                        //   console.log(res,'res');
                                        if (res.length > 0) {
                                            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${course_subject[i].course_subject_id}_global_course_subject_id_wow_flashcards`) == 1) {
                                                for (let i = 0; i < res.length; i++) {
                                                    await dbConnection.query(`select * from ${global_course_subject_id_wow_flashcards} where global_wow_flashcards_id=${res[i].global_wow_flashcards_id}`).then((res_1: any) => {
                                                        // console.log(res,'asasasa');
                                                        if (res_1.length > 0) {
                                                            global_flashcards_id = res[i].global_wow_flashcards_id
                                                            // console.log('res_1',global_flashcards_id)
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    })
                                }

                                if (globalEducationalInstitutionName.length > 0) {
                                    Reflect.defineProperty(globalEducationalInstitutionName[0], 'registered_educational_institution_name',
                                        Reflect.getOwnPropertyDescriptor(globalEducationalInstitutionName[0], 'educational_institution_category_name'))
                                    Reflect.deleteProperty(globalEducationalInstitutionName[0], 'educational_institution_category_name')
                                }
                                // console.log(res[0],'global_flashcards_id',global_flashcards_id);

                                final_results.push(Object.assign({
                                    course_subject_name: res[0]?.course_subject_name,
                                    course_subject_type: res[0]?.course_subject_type,
                                    educational_institution_category_country_code: res[0].educational_institutional_category_country_code,
                                    educational_institution_category_id: res[0].educational_institutional_category_id,
                                    global_course_subject_id: res[0].global_course_subject_id,
                                    ...globalEducationalInstitutionName[0],
                                    is_global: course_subject[i]?.is_global,
                                    subject_ids, global_flashcards_id,
                                    is_shared_globally: course_subject[i]?.is_shared_globally
                                }))
                                // console.log(res[0],'globalllllllllllllllllllllllllllll')
                                // final_results.push(Object.assign(res[0], globalEducationalInstitutionName[0], { is_global: course_subject[i].is_global, subject_ids, global_flashcards_id }))
                            }
                            await dbConnection.query(`
                               select * from 
                               ${default_global_subjects_courses_for_educational_Inst_categories_tbl_name}
                               where global_course_subject_id=${course_subject_id}
                               and educational_institutional_category_country_code=${mysql.escape(educational_institution_category_country_code)}
                               and educational_institutional_category_id=${mysql.escape(educational_institution_category_id)}  
                               and last_update_datetime < CURRENT_TIMESTAMP order by last_update_datetime desc limit 1
                            `).then(async (res: any) => {
                                if (res.length > 0) {
                                    // console.log('resss', res)
                                    await global_data(res)
                                } else {
                                    // console.log('el')
                                    const user_id_global_course_subject_of_interest = `${country_code}_${customer_id}_edu_customer_db.${user_id}_user_id_global_course_subject_of_interest`
                                    await dbConnection.query(`select 
                                        educational_institution_category_country_code as educational_institutional_category_country_code,
                                        educational_institution_category_id as educational_institutional_category_id,
                                        global_course_subject_id
                                        from ${user_id_global_course_subject_of_interest}  
                                        where global_course_subject_id=${course_subject_id}
                                        and educational_institution_category_country_code=${mysql.escape(educational_institution_category_country_code)}
                                        and educational_institution_category_id=${mysql.escape(educational_institution_category_id)}  
                                    `).then(async (res: any) => {
                                        // console.log(res, 'res')
                                        if (res.length > 0) {
                                            await global_data(res)
                                        }

                                    })
                                }
                            })

                        }
                        if (course_subject[i].is_global == false) {
                            await dbConnection.query(`
                               select * from ${institutional_study_subjects_courses_details} where institutional_course_subject_id=${course_subject[i].course_subject_id}
                           `).then(async (res: any) => {
                                if (res.length > 0) {
                                    // const internalEducationalInstitutionName = await dbConnection.query(`
                                    // select educational_institution_category_name from
                                    // ${educational_institutions_categories} where 
                                    // country_code = ${mysql.escape(educational_institution_category_country_code)} and 
                                    // educational_institution_category_id = ${mysql.escape(educational_institution_category_id)}`);

                                    const internalEducationalInstitutionName = await dbConnection.query(`select  * from ${global_registered_wow_customers_master_data} where customer_id = ${customer_id}`);
                                    const descriptor = Object.getOwnPropertyDescriptor(res[0], 'country_code_of_user_id');
                                    Reflect.defineProperty(res[0], 'educational_institutional_category_country_code', descriptor);
                                    Reflect.deleteProperty(res[0], 'country_code_of_user_id');

                                    // if (internalEducationalInstitutionName.length > 0) {
                                    //     Reflect.defineProperty(internalEducationalInstitutionName[0], 'registered_educational_institution_name',
                                    //         Reflect.getOwnPropertyDescriptor(internalEducationalInstitutionName[0], 'educational_institution_category_name'))
                                    //     Reflect.deleteProperty(internalEducationalInstitutionName[0], 'educational_institution_category_name')
                                    // }
                                    // console.log(res[0], 'localllllllllllllllllllllllllll')

                                    final_results.push(Object.assign({
                                        institutional_course_subject_id: res[0].institutional_course_subject_id,
                                        course_subject_type: res[0].course_subject_type,
                                        course_subject_name: res[0].course_subject_name,
                                        educational_institutional_category_country_code: res[0].educational_institutional_category_country_code,
                                        educational_institution_category_id,
                                        educational_institution_category_country_code,
                                        ...internalEducationalInstitutionName[0],
                                        is_global: course_subject[i].is_global, subject_ids,
                                        is_shared_globally: course_subject[i]?.is_shared_globally

                                    }))
                                    // final_results.push(Object.assign(res[0],
                                    //     internalEducationalInstitutionName[0], { is_global: course_subject[i].is_global, subject_ids ,
                                    //         educational_institution_category_country_code,educational_institution_category_id}))
                                }
                            })
                        }
                        // console.log(final_results)
                    }
                }
            })
            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.GET,
                data: final_results
            }
        } catch (error) {
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }
    // ListOfLinedSyllabusSharedAndUnShared
    async ListOfLinedSyllabusSharedAndUnShared(customer_id, country_code, user_id, time_zone_iana_string, data) {
        try {
            // console.log(data);
            const edu_customer_db = `${country_code}_${customer_id}_edu_customer_db`;
            var serverLocalDateFormate = this._dateTimeService.getDateTime(time_zone_iana_string);
            let {
                global_flashcards_id,
                is_shared_globally,
                global_course_subject_id
            } = data[0];

            let {
                institutional_wow_flashcards_id,
                syllabus_id,
                wow_flashcards_name
            } = data[1];
            if (is_shared_globally == 0) {
                await dbConnection.query(`
                insert into global_wow_flashcards_db.global_wow_flashcards_master(
                    globalized_datetime,
                    institutional_flashcards_db_entry_creator_customer_country_code,
                    institutional_flashcards_db_entry_creator_customer_id,
                    institutional_flashcards_db_entry_creator_user_id,
                    institutional_wow_flashcards_id,
                    wow_flashcards_name
                )values(
                    ${mysql.escape(serverLocalDateFormate)},
                    ${mysql.escape(country_code).toUpperCase()},
                    ${mysql.escape(customer_id)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(institutional_wow_flashcards_id)},
                    ${mysql.escape(wow_flashcards_name)}
                )
                `).then(async (res) => {
                    // console.log(res.insertId,'insert');
                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${global_course_subject_id}_global_course_subject_id_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                        update ${edu_customer_db}.34_userapp_institutional_wow_flashcards_master 
                        set flashcards_edited_datetime = ${mysql.escape(serverLocalDateFormate)},global_wow_flashcards_id =${mysql.escape(res.insertId)}
                         where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                        `);

                        await dbConnection.query(`
                        update ${edu_customer_db}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage 
                        set is_shared_globally = 1 where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                        `)
                        for (let i = 0; i < syllabus_id.length; i++) {
                            await dbConnection.query(`
                            insert into global_wow_flashcards_db.${global_course_subject_id}_global_course_subject_id_wow_flashcards(
                                global_wow_flashcards_id,
                                syllabus_id
                            )values(
                                ${mysql.escape(res.insertId)},
                                ${mysql.escape(syllabus_id[i])}
                            )
                            `)
                        }
                        // 34_audit_trail_for_your_wow_flashcards 
                        if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                            await dbConnection.query(`
                            insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                             entry_type,
                             entry_date_time,
                             entry_by_user_id,
                             institutional_wow_flashcards_id,
                             global_wow_flashcards_id
                             )values(
                              'Inserted',
                              ${mysql.escape(serverLocalDateFormate)},
                              ${mysql.escape(user_id)},
                              ${mysql.escape(institutional_wow_flashcards_id)},
                              ${mysql.escape(res.insertId)}
                            )
                            `)
                        } else {
                            await dbConnection.query(`
                          create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           id int not null auto_increment primary key,
                           entry_type varchar(50),
                           entry_date_time datetime,
                           entry_by_user_id int,
                           global_wow_flashcards_id int,
                           institutional_wow_flashcards_id int
                          )
                          `)
                            await dbConnection.query(`
                          insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           entry_type,
                           entry_date_time,
                           entry_by_user_id,
                           institutional_wow_flashcards_id,
                           global_wow_flashcards_id
                           )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(institutional_wow_flashcards_id)},
                            ${mysql.escape(res.insertId)}
                          )
                          `)
                        }
                    } else {
                        await dbConnection.query(`
                    create table global_wow_flashcards_db.${global_course_subject_id}_global_course_subject_id_wow_flashcards(
                    global_wow_flashcards_id int,
                    syllabus_id varchar(50)
                    )
                    `);

                        await dbConnection.query(`
                    update ${edu_customer_db}.34_userapp_institutional_wow_flashcards_master 
                    set flashcards_edited_datetime = ${mysql.escape(serverLocalDateFormate)},global_wow_flashcards_id =${mysql.escape(res.insertId)}
                     where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                    `);

                        await dbConnection.query(`
                    update ${edu_customer_db}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage 
                    set is_shared_globally = 1 where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                    `)
                        for (let i = 0; i < syllabus_id.length; i++) {
                            await dbConnection.query(`
                        insert into global_wow_flashcards_db.${global_course_subject_id}_global_course_subject_id_wow_flashcards(
                            global_wow_flashcards_id,
                            syllabus_id
                        )values(
                            ${mysql.escape(res.insertId)},
                            ${mysql.escape(syllabus_id[i])}
                        )
                        `)
                        }
                        // 34_audit_trail_for_your_wow_flashcards 
                        if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                            await dbConnection.query(`
                            insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                             entry_type,
                             entry_date_time,
                             entry_by_user_id,
                             institutional_wow_flashcards_id,
                             global_wow_flashcards_id
                             )values(
                              'Inserted',
                              ${mysql.escape(serverLocalDateFormate)},
                              ${mysql.escape(user_id)},
                              ${mysql.escape(institutional_wow_flashcards_id)},
                              ${mysql.escape(res.insertId)}
                            )
                            `)
                        } else {
                            await dbConnection.query(`
                          create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           id int not null auto_increment primary key,
                           entry_type varchar(50),
                           entry_date_time datetime,
                           entry_by_user_id int,
                           global_wow_flashcards_id int,
                           institutional_wow_flashcards_id int
                          )
                          `)
                            await dbConnection.query(`
                          insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           entry_type,
                           entry_date_time,
                           entry_by_user_id,
                           institutional_wow_flashcards_id,
                           global_wow_flashcards_id
                           )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(institutional_wow_flashcards_id)},
                            ${mysql.escape(res.insertId)}
                          )
                          `)
                        }
                    }
                })
            } else if (is_shared_globally == 1) {
                // console.log('is_shared_globally');
                await dbConnection.query(`
                        update ${edu_customer_db}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage 
                        set is_shared_globally = 0 where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)}
                        `);

                await dbConnection.query(`
                        delete from global_wow_flashcards_db.${global_course_subject_id}_global_course_subject_id_wow_flashcards
                        where global_wow_flashcards_id = ${mysql.escape(global_flashcards_id)}
                        `)
                // 34_audit_trail_for_your_wow_flashcards 
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                            insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                             entry_type,
                             entry_date_time,
                             entry_by_user_id,
                             institutional_wow_flashcards_id
                             )values(
                              'Updated',
                              ${mysql.escape(serverLocalDateFormate)},
                              ${mysql.escape(user_id)},
                              ${mysql.escape(institutional_wow_flashcards_id)}
                            )
                            `)
                } else {
                    await dbConnection.query(`
                          create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           id int not null auto_increment primary key,
                           entry_type varchar(50),
                           entry_date_time datetime,
                           entry_by_user_id int,
                           global_wow_flashcards_id int,
                           institutional_wow_flashcards_id int
                          )
                          `)
                    await dbConnection.query(`
                          insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                           entry_type,
                           entry_date_time,
                           entry_by_user_id,
                           institutional_wow_flashcards_id
                           )values(
                            'updated',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(institutional_wow_flashcards_id)}
                          )
                          `)
                }
            }
        } catch (error) {
            return error;
        }
    }
    // ListOfLinedSyllabusLinkNewRelevantSyllabus
    async ListOfLinedSyllabusLinkNewRelevantSyllabus(
        country_code,
        customer_id,
        user_id,
        institutional_wow_flashcards_id
    ): Promise<any> {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let finalResult: any[] = [];
            let finalResult_1: any[] = [];
            let local_wth_dup_course_ids: any;
            let global_wth_dup_course_ids: any;
            let local_wth_rmv_dup_course_ids: any;
            let global_wth_rmv_dup_course_ids: any
            let userapp_institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;

            await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 0 `).then((res: any) => {
                // console.log(res);
                local_wth_dup_course_ids = res.map(item => ({
                    course_subject_id: item.course_subject_id,
                    educational_institution_category_country_code: item.educational_institution_category_country_code,
                    educational_institution_category_id: item.educational_institution_category_id
                }))
            })

            await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 1 `).then((res: any) => {
                global_wth_dup_course_ids = res.map(item => (({
                    course_subject_id: item.course_subject_id,
                    educational_institution_category_country_code: item.educational_institution_category_country_code,
                    educational_institution_category_id: item.educational_institution_category_id
                })))
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

            local_wth_rmv_dup_course_ids = [...removeDuplicates(local_wth_dup_course_ids)];
            global_wth_rmv_dup_course_ids = [...removeDuplicates(global_wth_dup_course_ids)];


            let all_courseSubjectIds = Reflect.get(await this.CommonService.data_share_for_get_all_wow_flashcards(`${country_code}`, customer_id, user_id), 'institution_study_courses')

            let flr_local_course_ids = (key: any) => {
                // console.log(key,'key')
                for (let i = 0; i < local_wth_rmv_dup_course_ids.length; i++) {
                    let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = local_wth_rmv_dup_course_ids[i]
                    if (course_subject_id == key.institutional_course_subject_id &&
                        educational_institution_category_country_code == key.educational_institution_category_country_code &&
                        educational_institution_category_id == key.educational_institution_category_id
                    ) {
                        return 0
                    }
                }
                return -1
            }

            let flr_global_course_ids = (key: any) => {
                for (let i = 0; i < global_wth_rmv_dup_course_ids.length; i++) {
                    let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = global_wth_rmv_dup_course_ids[i]
                    if (course_subject_id == key.global_course_subject_id &&
                        educational_institution_category_country_code == key.educational_institution_category_country_code &&
                        educational_institution_category_id == key.educational_institution_category_id
                    ) {
                        return 0
                    }
                }
                return -1
            }
            let local_datas: any = []
            let global_datas: any = []
            for (let i = 0; i < all_courseSubjectIds.length; i++) {
                //  console.log(flr_local_course_ids(all_courseSubjectIds[i]) , 'local' , all_courseSubjectIds[i])

                if (flr_local_course_ids(all_courseSubjectIds[i]) == -1 && all_courseSubjectIds[i].global_course_subject_id == null) {
                    local_datas.push(all_courseSubjectIds[i])
                }

                if (flr_global_course_ids(all_courseSubjectIds[i]) == -1 && all_courseSubjectIds[i].global_course_subject_id != null) {
                    global_datas.push(all_courseSubjectIds[i])
                }

            }
            // console.log(local_datas, 'local')
            // console.log(global_datas, 'global')

            let flr_ints_global_info = (key: any) => {
                // console.log('key', key)
                for (let i = 0; i < global_wth_rmv_dup_course_ids.length; i++) {
                    let { course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = global_wth_rmv_dup_course_ids[i]
                    if (course_subject_id == key.global_course_subject_id &&
                        educational_institution_category_country_code == key.educational_institution_category_country_code &&
                        educational_institution_category_id == key.educational_institution_category_id
                    ) {
                        return 0
                    }
                }
                return -1
            }

            let inst = Reflect.get(await this.CommonService.data_share_for_get_all_wow_flashcards(`${country_code}`, customer_id, user_id), 'inst');
            let flr_inst_global_list: any[] = []
            for (let i = 0; i < inst.length; i++) {
                // console.log(flr_ints_global_info(inst[i]), '(flr_ints_global_info(inst[i])')
                if (flr_ints_global_info(inst[i]) == -1) {
                    flr_inst_global_list.push(inst[i])
                }
            }
            let courseSubjectIds = local_datas.concat(global_datas)

            let wch_part1 = global_wth_rmv_dup_course_ids.length > 0 ? flr_inst_global_list : inst;
            // console.log(courseSubjectIds, wch_part1)
            const joinedTwoArrays = [...courseSubjectIds, ...wch_part1];
            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.ADD,
                data: joinedTwoArrays
            }
            // return joinedTwoArrays;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // ListOfLinedSyllabusEditLinkRelevantSyllabus
    async ListOfLinedSyllabusEditLinkRelevantSyllabus(
        country_code,
        customer_id,
        user_id,
        institutional_wow_flashcards_id,
        course_subject_id,
        is_global,
    ) {
        try {
            // console.log('000');
            let local_wth_dup_course_ids: any[] = [];
            let global_wth_dup_course_ids: any[] = [];
            let local_wth_rmv_dup_course_ids: any;
            let global_wth_rmv_dup_course_ids: any;
            let get_syllabus_ids: any;
            let userapp_institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;

            await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 0`).then((res: any) => {
                res.map(item => {
                    if (item.course_subject_id == course_subject_id && item.is_global != is_global) {
                        local_wth_dup_course_ids.push(item.course_subject_id)
                    } else if (item.course_subject_id != course_subject_id) {
                        local_wth_dup_course_ids.push(item.course_subject_id)
                    }
                })
            })

            await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and is_global = 1 `).then((res: any) => {
                res.map(item => {
                    if (item.course_subject_id == course_subject_id && item.is_global != is_global) {
                        global_wth_dup_course_ids.push(item.course_subject_id)
                    } else if (item.course_subject_id != course_subject_id) {
                        global_wth_dup_course_ids.push(item.course_subject_id)
                    }
                })
            })

            local_wth_rmv_dup_course_ids = [...new Set(local_wth_dup_course_ids)];
            global_wth_rmv_dup_course_ids = [...new Set(global_wth_dup_course_ids)];

            // console.log(global_wth_dup_course_ids, 'sdwe')

            const { institution_study_courses, inst } = await this.CommonService.data_share_for_get_all_wow_flashcards(`${country_code}`, customer_id, user_id);
            let all_courseSubjectIds = institution_study_courses;

            let flr_local_course_ids = (key: any) => {
                for (let i = 0; i < local_wth_rmv_dup_course_ids.length; i++) {
                    if (local_wth_rmv_dup_course_ids[i] == key) {
                        return 0
                    }
                }
                return -1
            }

            let flr_global_course_ids = (key: any) => {
                for (let i = 0; i < global_wth_rmv_dup_course_ids.length; i++) {
                    if (global_wth_rmv_dup_course_ids[i] == key) {
                        return 0
                    }
                }
                return -1
            }

            let local_datas: any = []
            let global_datas: any = []

            for (let i = 0; i < all_courseSubjectIds.length; i++) {
                let { institutional_course_subject_id, global_course_subject_id } = all_courseSubjectIds[i]
                if (flr_local_course_ids(institutional_course_subject_id) == -1 && global_course_subject_id == null) {
                    local_datas.push(all_courseSubjectIds[i])
                }

                if (flr_global_course_ids(global_course_subject_id) == -1 && global_course_subject_id != null) {
                    global_datas.push(all_courseSubjectIds[i])
                }

            }


            let courseSubjectIds = local_datas.concat(global_datas)

            let flr_ints_global_info = (key: any) => {
                for (let i = 0; i < global_wth_rmv_dup_course_ids.length; i++) {
                    if (global_wth_rmv_dup_course_ids[i] == key) {
                        return 0
                    }
                }
                return -1
            }
            // console.log(global_wth_rmv_dup_course_ids, 'global_wth_rmv_dup_course_ids');
            let flr_inst_global_list: any[] = []
            for (let i = 0; i < inst.length; i++) {
                if (flr_ints_global_info(inst[i].global_course_subject_id) == -1) {
                    flr_inst_global_list.push(inst[i])
                }
            }

            let wch_part1 = global_wth_rmv_dup_course_ids.length > 0 ? flr_inst_global_list : inst
            // console.log(wch_part1,'wch_part1')

            // console.log(global_datas)
            // console.log(inst)

            const joinedTwoArrays = [...courseSubjectIds, ...wch_part1];

            get_syllabus_ids = await dbConnection.query(`
            select * from ${userapp_institutional_wow_flashcards_syllabus_linkage}
            where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and course_subject_id = ${mysql.escape(course_subject_id)} and is_global = ${mysql.escape(is_global)}
            `)
            // console.log(get_syllabus_ids,'get_syllabus_ids');

            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.GET,
                data: { joinedTwoArrays, get_syllabus_ids }
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // ListOfLinkedSyllabusAddAndUpdate
    async ListOfLinkedSyllabusAddAndUpdate(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        data
    ) {
        try {
            // console.log(data,'fff');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // console.log(dbName,'dbName');
            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );
            let {
                is_insert_or_update,
                institutional_wow_flashcards_id,
                institutional_course_subject_id,
                global_course_subject_id,
                is_global,
                educational_institution_category_country_code,
                educational_institution_category_id,
                is_shared_globally,
                syllabus_id
            } = data;
            let course_subject_id: any;
            if (is_global == 0) {
                course_subject_id = institutional_course_subject_id
            } else if (is_global == 1) {
                course_subject_id = global_course_subject_id
            }
            if (is_insert_or_update == 0) {
                if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                    for (let i = 0; i < syllabus_id.length; i++) {
                        // console.log(institutional_wow_flashcards_id,'institutional_wow_flashcards_id');
                        await dbConnection.query(`
                        insert into ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage(
                            institutional_wow_flashcards_id,
                            course_subject_id,
                            is_global,
                            educational_institution_category_country_code,
                            educational_institution_category_id,
                            syllabus_id,
                            is_shared_globally
                        )values(
                            ${mysql.escape(institutional_wow_flashcards_id)},
                            ${mysql.escape(course_subject_id)},
                            ${mysql.escape(is_global)},
                            ${mysql.escape(educational_institution_category_country_code)},
                            ${mysql.escape(educational_institution_category_id)},
                            ${mysql.escape(syllabus_id[i])},
                            ${mysql.escape(is_shared_globally)}
                        )
                        `);
                    }
                    // 34_audit_trail_for_your_wow_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                            insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                             entry_type,
                             entry_date_time,
                             entry_by_user_id,
                             institutional_wow_flashcards_id
                             )values(
                              'Inserted',
                              ${mysql.escape(serverLocalDateFormate)},
                              ${mysql.escape(user_id)},
                              ${mysql.escape(institutional_wow_flashcards_id)}
                            )
                            `)
                    } else {
                        await dbConnection.query(`
                          create table ${dbName}.34_audit_trail_for_your_wow_flashcards(
                           id int not null auto_increment primary key,
                           entry_type varchar(50),
                           entry_date_time datetime,
                           entry_by_user_id int,
                           global_wow_flashcards_id int,
                           institutional_wow_flashcards_id int
                          )
                          `)
                        await dbConnection.query(`
                          insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                           entry_type,
                           entry_date_time,
                           entry_by_user_id,
                           institutional_wow_flashcards_id
                           )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(institutional_wow_flashcards_id)}
                          )
                          `)
                    }
                } else {
                    await dbConnection.query(`
                    create table ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage(
                        institutional_wow_flashcards_id	int,
                        course_subject_id int,
                        is_global boolean,
                        educational_institution_category_country_code varchar(3),
                        educational_institution_category_id	varchar(100),
                        syllabus_id	varchar(50),
                        is_shared_globally boolean
                    )
                    `);
                    for (let i = 0; i < syllabus_id.length; i++) {
                        await dbConnection.query(`
                            insert into ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage(
                                institutional_wow_flashcards_id,
                                course_subject_id,
                                is_global,
                                educational_institution_category_country_code,
                                educational_institution_category_id,
                                syllabus_id,
                                is_shared_globally
                            )values(
                                ${mysql.escape(institutional_wow_flashcards_id)},
                                ${mysql.escape(course_subject_id)},
                                ${mysql.escape(is_global)},
                                ${mysql.escape(educational_institution_category_country_code)},
                                ${mysql.escape(educational_institution_category_id)},
                                ${mysql.escape(syllabus_id[i])},
                                ${mysql.escape(is_shared_globally)}
                            )
                            `);
                    }

                    // 34_audit_trail_for_your_wow_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                            insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                             entry_type,
                             entry_date_time,
                             entry_by_user_id,
                             institutional_wow_flashcards_id
                             )values(
                              'Inserted',
                              ${mysql.escape(serverLocalDateFormate)},
                              ${mysql.escape(user_id)},
                              ${mysql.escape(institutional_wow_flashcards_id)}
                            )
                            `)
                    } else {
                        await dbConnection.query(`
                          create table ${dbName}.34_audit_trail_for_your_wow_flashcards(
                           id int not null auto_increment primary key,
                           entry_type varchar(50),
                           entry_date_time datetime,
                           entry_by_user_id int,
                           global_wow_flashcards_id int,
                           institutional_wow_flashcards_id int
                          )
                          `)
                        await dbConnection.query(`
                          insert into ${dbName}.34_audit_trail_for_your_wow_flashcards(
                           entry_type,
                           entry_date_time,
                           entry_by_user_id,
                           institutional_wow_flashcards_id
                           )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(institutional_wow_flashcards_id)}
                          )
                          `)
                    }
                }
            } else if (is_insert_or_update == 1) {
                for (let i = 0; i < syllabus_id.length; i++) {
                    const check_data =
                        await dbConnection.query(`
                    select count(*) as count from ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage
                    where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} 
                    and course_subject_id = ${mysql.escape(course_subject_id)} 
                    and is_global = ${mysql.escape(is_global)} 
                    and syllabus_id = ${mysql.escape(syllabus_id[i])};
                    `);

                    // console.log(check_data[0]?.count,'fkdf');
                    if (check_data[0]?.count == 0) {
                        // console.log('kadhal mannan');
                        await dbConnection.query(`
                            insert into ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage(
                                institutional_wow_flashcards_id,
                                course_subject_id,
                                is_global,
                                educational_institution_category_country_code,
                                educational_institution_category_id,
                                syllabus_id,
                                is_shared_globally
                            )values(
                                ${mysql.escape(institutional_wow_flashcards_id)},
                                ${mysql.escape(course_subject_id)},
                                ${mysql.escape(is_global)},
                                ${mysql.escape(educational_institution_category_country_code)},
                                ${mysql.escape(educational_institution_category_id)},
                                ${mysql.escape(syllabus_id[i])},
                                ${mysql.escape(is_shared_globally)}
                            )
                            `);
                    }
                }
            }
        } catch (error) {
            return error;
        }
    }
    // ListOfLinkedSyllabusRemove 
    async ListOfLinkedSyllabusRemove(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        data
    ) {
        try {
            // console.log(data,'fs');
            const edu_customer_db = `${country_code}_${customer_id}_edu_customer_db`;
            var serverLocalDateFormate = this._dateTimeService.getDateTime(time_zone_iana_string);
            let userapp_institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            let {
                is_global,
                global_course_subject_id,
                institutional_course_subject_id,
                subject_ids
            } = data.selected_table_value;

            let {
                institutional_wow_flashcards_id,
                is_shared_globally,
                global_wow_flashcards_id
            } = data.receive_radio_button_value[0];

            let course_subject_id: any;
            if (is_global == 0) {
                course_subject_id = institutional_course_subject_id;
            } else if (is_global == 1) {
                course_subject_id = global_course_subject_id;
            }
            // console.log(institutional_wow_flashcards_id,'institutional_wow_flashcards_id',course_subject_id,is_global,)
            const check_data =
                await dbConnection.query(`
            select count(*) as count from ${userapp_institutional_wow_flashcards_syllabus_linkage}
            where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and course_subject_id = ${mysql.escape(course_subject_id)} and is_global = ${mysql.escape(is_global)};
            `);

            // console.log(check_data[0]?.count,'check_data[0]?.count')
            if (check_data[0]?.count > 0) {
                await dbConnection.query(`
                DELETE FROM ${userapp_institutional_wow_flashcards_syllabus_linkage}
                where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and course_subject_id = ${mysql.escape(course_subject_id)} and is_global = ${mysql.escape(is_global)};
                `);

                if (is_shared_globally == 1) {
                    for (let i = 0; i < subject_ids.length; i++) {
                        if (subject_ids.length > 0) {
                            await dbConnection.query(`
                            DELETE FROM global_wow_flashcards_db.${course_subject_id}_global_course_subject_id_wow_flashcards 
                            where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)} and syllabus_id = ${mysql.escape(subject_ids[i])}
                            `)
                        }
                    }
                }
                // 34_audit_trail_for_your_wow_flashcards 
                if (await this.helper.tableExists(`${edu_customer_db}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                                            insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                                             entry_type,
                                             entry_date_time,
                                             entry_by_user_id,
                                             institutional_wow_flashcards_id
                                             )values(
                                              'Deleted',
                                              ${mysql.escape(serverLocalDateFormate)},
                                              ${mysql.escape(user_id)},
                                              ${mysql.escape(institutional_wow_flashcards_id)}
                                            )
                                            `)
                } else {
                    await dbConnection.query(`
                                          create table ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                                           id int not null auto_increment primary key,
                                           entry_type varchar(50),
                                           entry_date_time datetime,
                                           entry_by_user_id int,
                                           global_wow_flashcards_id int,
                                           institutional_wow_flashcards_id int
                                          )
                                          `)
                    await dbConnection.query(`
                                          insert into ${edu_customer_db}.34_audit_trail_for_your_wow_flashcards(
                                           entry_type,
                                           entry_date_time,
                                           entry_by_user_id,
                                           institutional_wow_flashcards_id
                                           )values(
                                            'Deleted',
                                            ${mysql.escape(serverLocalDateFormate)},
                                            ${mysql.escape(user_id)},
                                            ${mysql.escape(institutional_wow_flashcards_id)}
                                          )
                                          `)
                }
            }
        } catch (error) {
            return error;
        }
    }
    // GetAllWowFlashcards
    async GetAllWowFlashcards(
        country_code,
        customer_id,
        user_id,
    ): Promise<any> {
        try {
            //   console.log('global');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let userapp_institutional_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            let userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const userapp_institutional_wow_flashcards_collaborators = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_collaborators`
            let finalResult: any[] = []
            //   let data_of_institutional_study: any[] = [];
            //   let data_of_global_course_subject_of_interest: any[] = [];
            // console.log(await this.CommonService.data_share_for_get_all_wow_flashcards(country_code, customer_id, user_id))
            let { institution_study_courses, inst } = await this.CommonService.data_share_for_get_all_wow_flashcards(country_code, customer_id, user_id)
            // console.log(institution_study_courses)
            let wth_dub_all_syllabus_ids: any[] = [], wth_out_dub_all_syllabus_ids: any[] = [];
            let wth_dub_all_wow_flashcards_ids: any[] = [], wth_out_dub_all_wow_flashcards_ids: any[] = [];
            let common = async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                // console.log(fetch_institutional_wow_flashcards_syllabus_linkage,'fetch_institutional_wow_flashcards_syllabus_linkage')
                let institutional_wow_flashcards_id = fetch_institutional_wow_flashcards_syllabus_linkage;
                let access_hidden: any;
                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                    access_hidden = ` select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${institutional_wow_flashcards_id}`
                    await dbConnection.query(`
                 ${access_hidden} 
              `).then(async (fetch_institutional_wow_flashcards_master: any) => {
                        console.log(fetch_institutional_wow_flashcards_master, 'd')
                        if (fetch_institutional_wow_flashcards_master.length > 0) {
                            // console.log('data','data')
                            let collaborated_user_info = async () => {
                                let userInfo: any[] = []
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
                                    await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id is not null`).then(async (data: any) => {
                                        if (data.length > 0) {
                                            for (let i = 0; i < data.length; i++) {
                                                await dbConnection.query(`SELECT * FROM ${country_code}_${customer_id}_edu_customer_db.user_profile where user_id=${data[i].collaborator_user_id};`).then((user_info: any) => {
                                                    userInfo.push(user_info[0])
                                                })
                                            }
                                        }
                                    })

                                }
                                return userInfo
                            }
                            let collaborated_with: any;
                            let main = async () => {
                                let global_comments: any;
                                let no_of_total_flags: any;
                                let no_of_resolved_flags: any;

                                if (fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id != null) {
                                    console.log(fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id, 'fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id')
                                    const global_wow_flashcards_id_comments = `global_wow_flashcards_db.${fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments`;
                                    const global_wow_flashcards_id_flagged_messages = `global_wow_flashcards_db.${fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`;

                                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id}_global_wow_flashcards_id_global_comments`) == 1) {
                                        await dbConnection.query(`
                         select count(*) as count from ${global_wow_flashcards_id_comments}
                    `).then((data: any) => {
                                            console.log('comment', data)
                                            global_comments = data[0].count
                                        })
                                    }

                                    if (await this.helper.tableExists(`global_wow_flashcards_db`, `${fetch_institutional_wow_flashcards_master[0].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                                        await dbConnection.query(`
                         select count(*) as count from ${global_wow_flashcards_id_flagged_messages}
                    `).then((data: any) => {
                                            no_of_total_flags = data[0].count
                                        })
                                        await dbConnection.query(`
                         select count(*) as count from ${global_wow_flashcards_id_flagged_messages} where resolved_by_user_id is not null
                    `).then((data: any) => {
                                            no_of_resolved_flags = data[0].count
                                        })
                                    }
                                }
                                // console.log(fetch_institutional_wow_flashcards_master[0],'fetch_institutional_wow_flashcards_master')
                                console.log(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`,);
                                let inst_flashcards_question_count: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                    inst_flashcards_question_count = await dbConnection.query(`
                                        select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                    `)
                                }
                                const flag_date_check = await this.helper.isWithinOneWeek(fetch_institutional_wow_flashcards_master[0]?.flashcards_edited_datetime);
                                finalResult.push(Object.assign(fetch_institutional_wow_flashcards_master[0], {
                                    flag_date_check,
                                    flag_new_date: flag_date_check,
                                    global_comments,
                                    no_of_total_flags,
                                    no_of_resolved_flags,
                                    collaborated_with,
                                    inst_flashcards_question_count
                                }))
                            }
                            if (fetch_institutional_wow_flashcards_master[0].flashcards_entry_creator_user_id == user_id) {
                                collaborated_with = await collaborated_user_info()
                                await main()

                            } else {

                                await dbConnection.query(`
                          select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id=${user_id}
                      `).then(async (data: any) => {
                                    if (data.length > 0) {
                                        collaborated_with = await collaborated_user_info()
                                        await main()
                                    }
                                })
                            }


                        }
                    })

                }

            }
            const joinedTwoArrays = [...institution_study_courses, ...inst];
            //   console.log(joinedTwoArrays, 'joinedTwoArrays')
            for (let i = 0; i < joinedTwoArrays.length; i++) {
                let get_tree_syllabus_details: any;
                // if (!joinedTwoArrays[i].hasOwnProperty('institutional_course_subject_id')) Reflect.defineProperty(joinedTwoArrays[i], 'institutional_course_subject_id', { value: undefined, enumerable: true })
                let { is_global, institutional_course_subject_id, global_course_subject_id } = joinedTwoArrays[i]
                if (is_global == true) {
                    if (await this.helper.tableExists(`edu_user_apps_common_data_db`, `${global_course_subject_id}_global_course_subject_id_syllabus_details`) == 1) {
                        get_tree_syllabus_details = await dbConnection.query(`select * from edu_user_apps_common_data_db.${global_course_subject_id}_global_course_subject_id_syllabus_details`);
                    }
                }
                if (is_global == false) {
                    if (await this.helper.tableExists(dbName, `30_userapp_${institutional_course_subject_id}_institutional_course_subject_id_syllabus_details `) == 1) {
                        get_tree_syllabus_details = await dbConnection.query(`select * from ${dbName}.30_userapp_${institutional_course_subject_id}_institutional_course_subject_id_syllabus_details `);
                    }
                }
                // console.log(get_tree_syllabus_details, 'get_tree_syllabus_details')
                function getAllSyllabusIds(syllabus) {
                    const ids = [syllabus.syllabus_id];
                    syllabus.children.forEach(child => {
                        ids.push(...getAllSyllabusIds(child)); // Spread operator used to flatten the nested arrays
                    });

                    return ids;
                }

                get_tree_syllabus_details = get_tree_syllabus_details != undefined ? get_tree_syllabus_details : [];
                if (get_tree_syllabus_details.length > 0) {
                    let process = await this.treeConstruct(get_tree_syllabus_details)
                    for (let i = 0; i < process.length; i++) {
                        wth_dub_all_syllabus_ids.push(...getAllSyllabusIds(process[i]))
                    }
                }
            }
            //   console.log(wth_dub_all_syllabus_ids, 'wth_dub_all_syllabus_ids')
            wth_out_dub_all_syllabus_ids.push(...new Set(wth_dub_all_syllabus_ids))
            for (let i = 0; i < wth_out_dub_all_syllabus_ids.length; i++) {
                let subject_id = wth_out_dub_all_syllabus_ids[i]

                await dbConnection.query(`select * from ${userapp_institutional_flashcards_syllabus_linkage} where syllabus_id=${mysql.escape(subject_id)}`).then((res_1: any) => {
                    // console.log(res_1,'res_1')
                    for (let i = 0; i < res_1.length; i++) {
                        wth_dub_all_wow_flashcards_ids.push(res_1[i].institutional_wow_flashcards_id)
                    }
                })
            }

            wth_out_dub_all_wow_flashcards_ids.push(...new Set(wth_dub_all_wow_flashcards_ids));
            for (let i = 0; i < wth_out_dub_all_wow_flashcards_ids.length; i++) {
                // console.log(wth_out_dub_all_wow_flashcards_ids[i], 'sdf')
                await common(wth_out_dub_all_wow_flashcards_ids[i])
            }
            return finalResult

        }
        catch (error) {
            return error;
        }
        //  catch (error) {
        //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        // }
    }
    //   GetAllAuditTrailValuesBasedOnResponses 
    async GetAllAuditTrailValuesBasedOnResponses(
        customer_id,
        country_code,
        user_id,
        data
    ) {
        try {
            let {
                pageno,
                per_page,
                type_of_menu
            } = data;
            // console.log('Data',data);
            const userCategory: any = [];
            const user_category_name: any = [];
            const getResult: any = [];

            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let offset = pageno * per_page;
            // menu 1 : 34_audit_trail_for_your_wow_flashcards
            // menu 2 : 34_audit_trail_for_global_wow_flashcards
            // menu 3 : 34_audit_trail_for_assign_wow_flashcards
            // menu 4 : 34_audit_trail_for_monetization_flashcards
            if (type_of_menu == 1) {
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_your_wow_flashcards`) == 1) {
                    const table_row_count =
                        await dbConnection.query(`SELECT COUNT(*) AS row_count FROM
                      ${dbName}.34_audit_trail_for_your_wow_flashcards;`);

                    // console.log(table_row_count,'table_row_count')
                    const auditTrail = await dbConnection.query(`
                    SELECT b.user_id,b.first_name,b.last_name,b.previous_login_image_of_the_day_ceph_object_id,
                    a.entry_type,date_format(a.entry_date_time,'%Y-%m-%d %H:%i:%s') as entry_date_time,
                    a.entry_by_user_id as login_user_id,
                    b.first_name as login_user_first_name,
                    b.last_name as login_user_second_name
                    FROM ${dbName}.34_audit_trail_for_your_wow_flashcards a 
                    left join ${dbName}.user_profile b on 
                    a.entry_by_user_id = b.user_id > 0 * 5 order by a.entry_date_time desc LIMIT ${offset},${per_page}
                    `);
                    // console.log(auditTrail,'auditTrail')
                    for (let i = 0; i < auditTrail.length; i++) {
                        const category_id = await dbConnection.query(`
                     SELECT user_category_id FROM ${dbName}.2_userapp_registered_users_registered_categories
                     where user_id=${auditTrail[i].login_user_id};
                         `);
                        // console.log(category_id.length);

                        for (let j = 0; j < category_id.length; j++) {
                            let category_table_length = await dbConnection.query(`
                               select * from ${dbName}.2_userapp_user_category
                               `);

                            let result1 = category_id[j].user_category_id;
                            let AlldataforStudent: any[] = [];
                            for (let i = 0; i < category_table_length.length; i++) {
                                let result = await dbConnection.query(`
                                   SELECT * FROM ${dbName}.2_userapp_user_category
                                   where user_category_id='${result1}'
                                   `);
                                if (result.length > 0) {
                                    result1 = result[0].parent_user_category_id;
                                    AlldataforStudent.push(result[0].user_category_name);
                                }
                            }
                            // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
                            userCategory.push(
                                AlldataforStudent.reverse().toString().replace(/,/g, '/'),
                            );
                        }
                    }
                    let audit_trail_text = 'WOW FlashCards';
                    for (let i = 0; i < auditTrail.length; i++) {
                        getResult.push({
                            ...auditTrail[i],
                            ...table_row_count[0],
                            user_category_name: user_category_name[i],
                            login_getster_category_name: userCategory[i],
                            customer_id: customer_id,
                            country_code: country_code,
                            user_id: user_id,
                            audit_trail_text
                        });
                    }
                }
            } else if (type_of_menu == 2) {
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                    const table_row_count =
                        await dbConnection.query(`SELECT COUNT(*) AS row_count FROM
                      ${dbName}.34_audit_trail_for_global_wow_flashcards;`);

                    // console.log(table_row_count,'table_row_count')
                    const auditTrail = await dbConnection.query(`
                    SELECT b.user_id,b.first_name,b.last_name,b.previous_login_image_of_the_day_ceph_object_id,
                    a.entry_type,date_format(a.entry_date_time,'%Y-%m-%d %H:%i:%s') as entry_date_time,
                    a.entry_by_user_id as login_user_id,
                    b.first_name as login_user_first_name,
                    b.last_name as login_user_second_name
                    FROM ${dbName}.34_audit_trail_for_global_wow_flashcards a 
                    left join ${dbName}.user_profile b on 
                    a.entry_by_user_id = b.user_id > 0 * 5 order by a.entry_date_time desc LIMIT ${offset},${per_page}
                    `);
                    // console.log(auditTrail,'auditTrail')
                    for (let i = 0; i < auditTrail.length; i++) {
                        const category_id = await dbConnection.query(`
                     SELECT user_category_id FROM ${dbName}.2_userapp_registered_users_registered_categories
                     where user_id=${auditTrail[i].login_user_id};
                         `);
                        // console.log(category_id.length);

                        for (let j = 0; j < category_id.length; j++) {
                            let category_table_length = await dbConnection.query(`
                               select * from ${dbName}.2_userapp_user_category
                               `);

                            let result1 = category_id[j].user_category_id;
                            let AlldataforStudent: any[] = [];
                            for (let i = 0; i < category_table_length.length; i++) {
                                let result = await dbConnection.query(`
                                   SELECT * FROM ${dbName}.2_userapp_user_category
                                   where user_category_id='${result1}'
                                   `);
                                if (result.length > 0) {
                                    result1 = result[0].parent_user_category_id;
                                    AlldataforStudent.push(result[0].user_category_name);
                                }
                            }
                            // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
                            userCategory.push(
                                AlldataforStudent.reverse().toString().replace(/,/g, '/'),
                            );
                        }
                    }
                    let audit_trail_text = 'Global WOW FlashCards';
                    for (let i = 0; i < auditTrail.length; i++) {
                        getResult.push({
                            ...auditTrail[i],
                            ...table_row_count[0],
                            user_category_name: user_category_name[i],
                            login_getster_category_name: userCategory[i],
                            customer_id: customer_id,
                            country_code: country_code,
                            user_id: user_id,
                            audit_trail_text
                        });
                    }
                }
            } else if (type_of_menu == 3) {
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_assign_wow_flashcards`) == 1) {
                    const table_row_count =
                        await dbConnection.query(`SELECT COUNT(*) AS row_count FROM
                      ${dbName}.34_audit_trail_for_assign_wow_flashcards;`);

                    // console.log(table_row_count,'table_row_count')
                    const auditTrail = await dbConnection.query(`
                    SELECT b.user_id,b.first_name,b.last_name,b.previous_login_image_of_the_day_ceph_object_id,
                    a.entry_type,date_format(a.entry_date_time,'%Y-%m-%d %H:%i:%s') as entry_date_time,
                    a.entry_by_user_id as login_user_id,
                    b.first_name as login_user_first_name,
                    b.last_name as login_user_second_name
                    FROM ${dbName}.34_audit_trail_for_assign_wow_flashcards a 
                    left join ${dbName}.user_profile b on 
                    a.entry_by_user_id = b.user_id > 0 * 5 order by a.entry_date_time desc LIMIT ${offset},${per_page}
                    `);
                    // console.log(auditTrail,'auditTrail')
                    for (let i = 0; i < auditTrail.length; i++) {
                        const category_id = await dbConnection.query(`
                     SELECT user_category_id FROM ${dbName}.2_userapp_registered_users_registered_categories
                     where user_id=${auditTrail[i].login_user_id};
                         `);
                        // console.log(category_id.length);

                        for (let j = 0; j < category_id.length; j++) {
                            let category_table_length = await dbConnection.query(`
                               select * from ${dbName}.2_userapp_user_category
                               `);

                            let result1 = category_id[j].user_category_id;
                            let AlldataforStudent: any[] = [];
                            for (let i = 0; i < category_table_length.length; i++) {
                                let result = await dbConnection.query(`
                                   SELECT * FROM ${dbName}.2_userapp_user_category
                                   where user_category_id='${result1}'
                                   `);
                                if (result.length > 0) {
                                    result1 = result[0].parent_user_category_id;
                                    AlldataforStudent.push(result[0].user_category_name);
                                }
                            }
                            // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
                            userCategory.push(
                                AlldataforStudent.reverse().toString().replace(/,/g, '/'),
                            );
                        }
                    }
                    let audit_trail_text = 'Assign WOW FlashCards to Students';
                    for (let i = 0; i < auditTrail.length; i++) {
                        getResult.push({
                            ...auditTrail[i],
                            ...table_row_count[0],
                            user_category_name: user_category_name[i],
                            login_getster_category_name: userCategory[i],
                            customer_id: customer_id,
                            country_code: country_code,
                            user_id: user_id,
                            audit_trail_text
                        });
                    }
                }
            } else if (type_of_menu == 4) {
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                    const table_row_count =
                        await dbConnection.query(`SELECT COUNT(*) AS row_count FROM
                      ${dbName}.34_audit_trail_for_monetization_flashcards;`);

                    // console.log(table_row_count,'table_row_count')
                    const auditTrail = await dbConnection.query(`
                    SELECT b.user_id,b.first_name,b.last_name,b.previous_login_image_of_the_day_ceph_object_id,
                    a.entry_type,date_format(a.entry_date_time,'%Y-%m-%d %H:%i:%s') as entry_date_time,
                    a.entry_by_user_id as login_user_id,
                    b.first_name as login_user_first_name,
                    b.last_name as login_user_second_name
                    FROM ${dbName}.34_audit_trail_for_monetization_flashcards a 
                    left join ${dbName}.user_profile b on 
                    a.entry_by_user_id = b.user_id > 0 * 5 order by a.entry_date_time desc LIMIT ${offset},${per_page}
                    `);
                    // console.log(auditTrail,'auditTrail')
                    for (let i = 0; i < auditTrail.length; i++) {
                        const category_id = await dbConnection.query(`
                     SELECT user_category_id FROM ${dbName}.2_userapp_registered_users_registered_categories
                     where user_id=${auditTrail[i].login_user_id};
                         `);
                        // console.log(category_id.length);

                        for (let j = 0; j < category_id.length; j++) {
                            let category_table_length = await dbConnection.query(`
                               select * from ${dbName}.2_userapp_user_category
                               `);

                            let result1 = category_id[j].user_category_id;
                            let AlldataforStudent: any[] = [];
                            for (let i = 0; i < category_table_length.length; i++) {
                                let result = await dbConnection.query(`
                                   SELECT * FROM ${dbName}.2_userapp_user_category
                                   where user_category_id='${result1}'
                                   `);
                                if (result.length > 0) {
                                    result1 = result[0].parent_user_category_id;
                                    AlldataforStudent.push(result[0].user_category_name);
                                }
                            }
                            // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
                            userCategory.push(
                                AlldataforStudent.reverse().toString().replace(/,/g, '/'),
                            );
                        }
                    }
                    let audit_trail_text = 'Monetization of Your WOW FlashCards';
                    for (let i = 0; i < auditTrail.length; i++) {
                        getResult.push({
                            ...auditTrail[i],
                            ...table_row_count[0],
                            user_category_name: user_category_name[i],
                            login_getster_category_name: userCategory[i],
                            customer_id: customer_id,
                            country_code: country_code,
                            user_id: user_id,
                            audit_trail_text
                        });
                    }
                }
            }
            return {
                status: HttpStatus.OK,
                message: 'Get Successful',
                data: getResult,
            };
        } catch (error) {
            return error;
        }
    }
    treeConstruct(treeData) {
        let constructedTree = [];
        for (let i of treeData) {
            let treeObj = i;
            let assigned = false;
            this.constructTree(constructedTree, treeObj, assigned);
        }
        return constructedTree;
    }
    constructTree(constructedTree, treeObj, assigned) {
        if (treeObj.syllabus_parent_id == null) {
            treeObj.children = [];
            constructedTree.push(treeObj);
            return true;
        } else if (treeObj.syllabus_parent_id === constructedTree.syllabus_id) {
            treeObj.children = [];
            constructedTree.children.push(treeObj);
            return true;
        } else {
            if (constructedTree.children != undefined) {
                for (let index = 0; index < constructedTree.children.length; index++) {
                    let constructedObj = constructedTree.children[index];
                    if (assigned == false) {
                        assigned = this.constructTree(constructedObj, treeObj, assigned);
                    }
                }
            } else {
                for (let index = 0; index < constructedTree.length; index++) {
                    let constructedObj = constructedTree[index];
                    if (assigned == false) {
                        assigned = this.constructTree(constructedObj, treeObj, assigned);
                    }
                }
            }
            return false;
        }
    }
}
