import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import { CommonRelevantSyllabus } from 'src/common/services/comon-relevant-syllabus/common.service';
import { DateTimeService } from 'src/common/services/date-time/date-time.service';
import { HelperService } from 'src/common/services/helper/helper.service';
import * as mysql from 'mysql2';
import { ResponseMessageEnum } from 'src/models/enum/response-message.enum';
@Injectable()
export class MonetizationOfYourWowFlashcardsService {
    constructor(private helper: HelperService, private _cmn: CommonRelevantSyllabus, private _dateTimeService: DateTimeService) { }
    // GetMonetizationOfYourWowFlashcardsListBasedOnSubjectIds
    async GetMonetizationOfYourWowFlashcardsListBasedOnSubjectIds(
        country_code,
        customer_id,
        subject_course,
        user_id,
        currency_code
    ) {
        try {
            const institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            const userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const userapp_institutional_wow_flashcards_collaborators = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_collaborators`;
            const userapp_wow_flashcards_monetization_prices = `${country_code}_${customer_id}_edu_customer_db.34_userapp_wow_flashcards_monetization_prices`;
            const global_registered_wow_customers_master_data = `global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data`;
            // console.log(subject_course, 'subject_course');
            let finalResult: any[] = []
            let common = async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                let institutional_wow_flashcards_id = fetch_institutional_wow_flashcards_syllabus_linkage;
                let access_hidden = `select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id}`
                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                    await dbConnection.query(`
                       ${access_hidden} 
                    `).then(async (fetch_institutional_wow_flashcards_master: any) => {
                        // console.log(fetch_institutional_wow_flashcards_master, 'd dfdvfdcccvf')
                        if (fetch_institutional_wow_flashcards_master.length > 0) {
                            let collaborated_user_info = async () => {
                                let userInfo: any[] = []
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_collaborators`) == 1) {
                                    await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id} and collaborator_user_id is not null`).then(async (data: any) => {
                                        if (data.length > 0) {
                                            for (let i = 0; i < data.length; i++) {
                                                await dbConnection.query(`SELECT * FROM ${country_code}_${customer_id}_edu_customer_db.user_profile where user_id = ${data[i].collaborator_user_id};`).then((user_info: any) => {
                                                    userInfo.push(user_info[0])
                                                })
                                            }
                                        }
                                    })

                                }
                                return userInfo
                            }
                            let collaborated_user_id: any;
                            if (fetch_institutional_wow_flashcards_master[0].flashcards_entry_creator_user_id == user_id) {
                                collaborated_user_id = await collaborated_user_info()
                            } else {
                                await dbConnection.query(`
                                select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id=${user_id}
                            `).then(async (data: any) => {
                                    if (data.length > 0) {
                                        collaborated_user_id = await collaborated_user_info()
                                    }
                                })
                            }
                            let monetization_info: any = null
                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_wow_flashcards_monetization_prices`) == 1) {
                                await dbConnection.query(`select * from ${userapp_wow_flashcards_monetization_prices} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id} order by effective_from_datetime desc`).then((res: any) => {
                                    if (res.length > 0) {
                                        monetization_info = { ...res[0] }
                                    }
                                })
                            }
                            let registered_educational_institution_name = await dbConnection.query(`select * from ${global_registered_wow_customers_master_data} where customer_id = ${customer_id}`).then((res: any) => {
                                if (res.length > 0) {
                                    return res[0].registered_educational_institution_name
                                }
                                return null
                            })

                            let tds_per_check: any;
                            if (await this.helper.tableExists(`edu_user_apps_common_data_db`, `edu_customers_platform_fees`) == 1) {
                                tds_per_check =
                                    await dbConnection.query(`
                                select tds_percentage from edu_user_apps_common_data_db.edu_customers_platform_fees where customer_country_code = ${mysql.escape(country_code)} order by effective_from_datetime desc limit 1;
                                `)
                            }
                            let inst_flashcards_question_count: any;
                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                inst_flashcards_question_count = await dbConnection.query(`
                                select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                            `)
                            }
                            // console.log(fetch_institutional_wow_flashcards_master[0],'fetch_institutional_wow_flashcards_master')
                            const flag_date_check =await this.helper.isWithinOneWeek(fetch_institutional_wow_flashcards_master[0]?.flashcards_edited_datetime);
                            finalResult.push(Object.assign(fetch_institutional_wow_flashcards_master[0], {
                                flag_new_date: flag_date_check,
                                tds_percentage: tds_per_check[0]?.tds_percentage,
                                collaborated_user_id,
                                monetization_info,
                                currency_code,
                                registered_educational_institution_name,
                                inst_flashcards_question_count
                            }))
                        }
                    })
                }

            }
            let { subject_course_info, subject_ids } = subject_course;
            let { global_course_subject_id, institutional_course_subject_id, educational_institution_category_country_code, educational_institution_category_id } = subject_course_info;
            // console.log(subject_course, 'subject_course');
            if (global_course_subject_id == null) {
                let duplicate_ids: any[] = []
                for (let iterate_subject_id = 0; iterate_subject_id < subject_ids.length; iterate_subject_id++) {
                    let subject_id = subject_ids[iterate_subject_id];
                    // console.log(subject_id)
                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                        await dbConnection.query(`
                      select * from ${institutional_wow_flashcards_syllabus_linkage} 
                      where course_subject_id = ${institutional_course_subject_id} 
                      and syllabus_id=${mysql.escape(subject_id)} and
                      educational_institution_category_country_code=${mysql.escape(educational_institution_category_country_code)} and 
                      educational_institution_category_id=${mysql.escape(educational_institution_category_id)} and is_global = 0 
                     `).then(async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                            console.log(fetch_institutional_wow_flashcards_syllabus_linkage, 'fetch_institutional_wow_flashcards_syllabus_linkage')
                            if (fetch_institutional_wow_flashcards_syllabus_linkage.length > 0) {
                                for (let i = 0; i < fetch_institutional_wow_flashcards_syllabus_linkage.length; i++) {
                                    duplicate_ids.push(fetch_institutional_wow_flashcards_syllabus_linkage[i].institutional_wow_flashcards_id)

                                }
                            }
                        })
                    }
                }
                let removed_duplicate_ids: any = [...new Set(duplicate_ids)];
                for (let i = 0; i < removed_duplicate_ids.length; i++) {
                    let institutional_wow_flashcards_id = removed_duplicate_ids[i];
                    // console.log(institutional_wow_flashcards_id, 'institutional_wow_flashcards_id')
                    await common(institutional_wow_flashcards_id)
                }
            }
            if (global_course_subject_id != null) {
                let duplicate_ids: any[] = []
                for (let iterate_subject_id = 0; iterate_subject_id < subject_ids.length; iterate_subject_id++) {
                    let subject_id = subject_ids[iterate_subject_id];
                    // console.log(subject_course.subject_course_info)
                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                        await dbConnection.query(`
                      select * from ${institutional_wow_flashcards_syllabus_linkage} where course_subject_id = ${global_course_subject_id} and syllabus_id=${mysql.escape(subject_id)} and
                      educational_institution_category_country_code=${mysql.escape(educational_institution_category_country_code)} and
                      educational_institution_category_id=${mysql.escape(educational_institution_category_id)} and is_global = 1
                   `).then(async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                            // console.log(fetch_institutional_wow_flashcards_syllabus_linkage, 'fetch_institutional_wow_flashcards_syllabus_linkage')
                            if (fetch_institutional_wow_flashcards_syllabus_linkage.length > 0) {
                                for (let i = 0; i < fetch_institutional_wow_flashcards_syllabus_linkage.length; i++) {
                                    duplicate_ids.push(fetch_institutional_wow_flashcards_syllabus_linkage[i].institutional_wow_flashcards_id)
                                }
                            }
                        })
                    }
                }
                let removed_duplicate_ids: any = [...new Set(duplicate_ids)];
                for (let i = 0; i < removed_duplicate_ids.length; i++) {
                    let institutional_wow_flashcards_id = removed_duplicate_ids[i];
                    // console.log(institutional_wow_flashcards_id, 'institutional_wow_flashcards_id')
                    await common(institutional_wow_flashcards_id)
                }
            }
            // console.log(finalResult, 'finalResult')
            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.GET,
                data: finalResult
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices
    async InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices(
        country_code,
        customer_id,
        user_id,
        time_zone_iana_string,
        data
    ) {
        try {
            // console.log(data,'InsertOrUpdateMonetizationOfYourWOWFlashcardsMonetizationPrices');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let {
                wow_flashcards_name,
                is_type,
                one_time_subscription_institutional_users_currency,
                one_time_subscription_global_users_currency,
                institutional_wow_flashcards_id,
                global_wow_flashcards_id,
                is_monetized_globally,
                is_monetized_for_the_institution,
                one_time_subscription_cost_per_user_for_institutional_users,
                one_time_subscription_cost_per_user_for_global_users,
                effective_from_datetime
            } = data;

            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );

            const date_time_formate = this._dateTimeService.formatDate(effective_from_datetime);

            // console.log(date_time_formate,'hi');

            if (is_type == 0) {
                if (await this.helper.tableExists(`${dbName}`, `34_userapp_wow_flashcards_monetization_prices`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_userapp_wow_flashcards_monetization_prices(
                        effective_from_datetime,
                        institutional_wow_flashcards_id,
                        is_monetized_globally,
                        is_monetized_for_the_institution,
                        one_time_subscription_cost_per_user_for_institutional_users,
                        one_time_subscription_institutional_users_currency,
                        one_time_subscription_cost_per_user_for_global_users,
                        one_time_subscription_global_users_currency,
                        entry_by_user_id 
                    )values(
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(institutional_wow_flashcards_id)},
                        ${mysql.escape(is_monetized_globally)},
                        ${mysql.escape(is_monetized_for_the_institution)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_institutional_users)},
                        ${mysql.escape(one_time_subscription_institutional_users_currency)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        ${mysql.escape(one_time_subscription_global_users_currency)},
                        ${mysql.escape(user_id)}
                    )
                    `);
                    if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                        await dbConnection.query(`
                        update global_wow_flashcards_db.global_wow_flashcards_master
                        set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                        where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `)
                    }
                    // 34_audit_trail_for_monetization_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
                    create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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

                    await dbConnection.query(`
                    insert into ${dbName}.34_userapp_wow_flashcards_monetization_prices(
                        effective_from_datetime,
                        institutional_wow_flashcards_id,
                        is_monetized_globally,
                        is_monetized_for_the_institution,
                        one_time_subscription_cost_per_user_for_institutional_users,
                        one_time_subscription_institutional_users_currency,
                        one_time_subscription_cost_per_user_for_global_users,
                        one_time_subscription_global_users_currency,
                        entry_by_user_id 
                    )values(
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(institutional_wow_flashcards_id)},
                        ${mysql.escape(is_monetized_globally)},
                        ${mysql.escape(is_monetized_for_the_institution)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_institutional_users)},
                        ${mysql.escape(one_time_subscription_institutional_users_currency)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        ${mysql.escape(one_time_subscription_global_users_currency)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                    if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                        await dbConnection.query(`
                        update global_wow_flashcards_db.global_wow_flashcards_master
                        set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                        where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `)
                    }
                    // 34_audit_trail_for_monetization_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
                    create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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

                // await dbConnection.query(`
                // insert into global_wow_flashcards_db.global_wow_flashcards_master(
                //     institutional_flashcards_db_entry_creator_customer_country_code,
                //     institutional_flashcards_db_entry_creator_customer_id,
                //     institutional_flashcards_db_entry_creator_user_id,
                //     institutional_wow_flashcards_id,
                //     wow_flashcards_name,
                //     one_time_subscription_cost_per_user_for_global_users,
                //     one_time_subscription_global_users_currency
                // )values(
                //     ${mysql.escape(country_code)},
                //     ${mysql.escape(customer_id)},
                //     ${mysql.escape(user_id)},
                //     ${mysql.escape(institutional_wow_flashcards_id)},
                //     ${mysql.escape(wow_flashcards_name)},
                //     ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                //     ${mysql.escape(one_time_subscription_global_users_currency)}
                // )
                // `)
                // if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                //     await dbConnection.query(`
                //         update global_wow_flashcards_db.global_wow_flashcards_master
                //         set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                //         one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                //         where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                //         `)
                // }

                // // 34_audit_trail_for_monetization_flashcards 
                // if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                //     await dbConnection.query(`
                //         insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
                //             entry_type,
                //             entry_date_time,
                //             entry_by_user_id,
                //             institutional_wow_flashcards_id
                //         )values(
                //             'Inserted',
                //             ${mysql.escape(serverLocalDateFormate)},
                //             ${mysql.escape(user_id)},
                //             ${mysql.escape(institutional_wow_flashcards_id)}
                //         )
                //         `)
                // } else {
                //     await dbConnection.query(`
                //     create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                //      id int not null auto_increment primary key,
                //      entry_type varchar(50),
                //      entry_date_time datetime,
                //      entry_by_user_id int,
                //      global_wow_flashcards_id int,
                //      institutional_wow_flashcards_id int
                //     )
                //     `)

                //     await dbConnection.query(`
                //     insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
                //         entry_type,
                //         entry_date_time,
                //         entry_by_user_id,
                //         institutional_wow_flashcards_id
                //     )values(
                //         'Inserted',
                //         ${mysql.escape(serverLocalDateFormate)},
                //         ${mysql.escape(user_id)},
                //         ${mysql.escape(institutional_wow_flashcards_id)}
                //     )
                //     `)
                // }
            } else if (is_type == 1) {
                if (await this.helper.tableExists(`${dbName}`, `34_userapp_wow_flashcards_monetization_prices`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_userapp_wow_flashcards_monetization_prices(
                        effective_from_datetime,
                        institutional_wow_flashcards_id,
                        is_monetized_globally,
                        is_monetized_for_the_institution,
                        one_time_subscription_cost_per_user_for_institutional_users,
                        one_time_subscription_institutional_users_currency,
                        one_time_subscription_cost_per_user_for_global_users,
                        one_time_subscription_global_users_currency,
                        entry_by_user_id 
                    )values(
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(institutional_wow_flashcards_id)},
                        ${mysql.escape(is_monetized_globally)},
                        ${mysql.escape(is_monetized_for_the_institution)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_institutional_users)},
                        ${mysql.escape(one_time_subscription_institutional_users_currency)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        ${mysql.escape(one_time_subscription_global_users_currency)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                    if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                        await dbConnection.query(`
                        update global_wow_flashcards_db.global_wow_flashcards_master
                        set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                        where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `)
                    }
                    // 34_audit_trail_for_monetization_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
                    create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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

                    await dbConnection.query(`
                    insert into ${dbName}.34_userapp_wow_flashcards_monetization_prices(
                        effective_from_datetime,
                        institutional_wow_flashcards_id,
                        is_monetized_globally,
                        is_monetized_for_the_institution,
                        one_time_subscription_cost_per_user_for_institutional_users,
                        one_time_subscription_institutional_users_currency,
                        one_time_subscription_cost_per_user_for_global_users,
                        one_time_subscription_global_users_currency,
                        entry_by_user_id 
                    )values(
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(institutional_wow_flashcards_id)},
                        ${mysql.escape(is_monetized_globally)},
                        ${mysql.escape(is_monetized_for_the_institution)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_institutional_users)},
                        ${mysql.escape(one_time_subscription_institutional_users_currency)},
                        ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        ${mysql.escape(one_time_subscription_global_users_currency)},
                        ${mysql.escape(user_id)}
                    )
                    `)
                    if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                        await dbConnection.query(`
                        update global_wow_flashcards_db.global_wow_flashcards_master
                        set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                        where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `)
                    }
                    if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                        await dbConnection.query(`
                        update global_wow_flashcards_db.global_wow_flashcards_master
                        set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                        one_time_subscription_global_users_currency = ${mysql.escape(one_time_subscription_global_users_currency)}
                        where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                        `)
                    }
                    // 34_audit_trail_for_monetization_flashcards 
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
                    create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `)

                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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

                // if (one_time_subscription_cost_per_user_for_global_users != null) {
                //     await dbConnection.query(`
                //     insert into global_wow_flashcards_db.global_wow_flashcards_master(
                //         institutional_flashcards_db_entry_creator_customer_country_code,
                //         institutional_flashcards_db_entry_creator_customer_id,
                //         institutional_flashcards_db_entry_creator_user_id,
                //         institutional_wow_flashcards_id,
                //         wow_flashcards_name,
                //         one_time_subscription_cost_per_user_for_global_users,
                //         one_time_subscription_global_users_currency
                //     )values(
                //         ${mysql.escape(country_code)},
                //         ${mysql.escape(customer_id)},
                //         ${mysql.escape(user_id)},
                //         ${mysql.escape(institutional_wow_flashcards_id)},
                //         ${mysql.escape(wow_flashcards_name)},
                //         ${mysql.escape(one_time_subscription_cost_per_user_for_global_users)},
                //         ${mysql.escape(one_time_subscription_global_users_currency)}
                //     )
                //     `)
                //     // 34_audit_trail_for_monetization_flashcards 
                //     if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                //        await dbConnection.query(`
                //        insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
                //            entry_type,
                //            entry_date_time,
                //            entry_by_user_id,
                //            institutional_wow_flashcards_id
                //        )values(
                //            'Inserted',
                //            ${mysql.escape(serverLocalDateFormate)},
                //            ${mysql.escape(user_id)},
                //            ${mysql.escape(institutional_wow_flashcards_id)}
                //        )
                //        `)
                //    } else {
                //        await dbConnection.query(`
                //    create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                //     id int not null auto_increment primary key,
                //     entry_type varchar(50),
                //     entry_date_time datetime,
                //     entry_by_user_id int,
                //     global_wow_flashcards_id int,
                //     institutional_wow_flashcards_id int
                //    )
                //    `)

                //    await dbConnection.query(`
                //    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
                //        entry_type,
                //        entry_date_time,
                //        entry_by_user_id,
                //        institutional_wow_flashcards_id
                //    )values(
                //        'Inserted',
                //        ${mysql.escape(serverLocalDateFormate)},
                //        ${mysql.escape(user_id)},
                //        ${mysql.escape(institutional_wow_flashcards_id)}
                //    )
                //    `)
                //    }
                // }

            } else if (is_type == 2) {
                await dbConnection.query(`
                update ${dbName}.34_userapp_wow_flashcards_monetization_prices 
                set effective_from_datetime = ${mysql.escape(serverLocalDateFormate)},
                is_monetized_globally =${mysql.escape(null)}, is_monetized_for_the_institution=${mysql.escape(null)},
                one_time_subscription_cost_per_user_for_institutional_users = ${mysql.escape(null)},
                one_time_subscription_institutional_users_currency =${mysql.escape(null)},
                one_time_subscription_cost_per_user_for_global_users =${mysql.escape(null)},
                one_time_subscription_global_users_currency =${mysql.escape(null)}
                where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and
                entry_by_user_id = ${mysql.escape(user_id)} and effective_from_datetime = ${mysql.escape(date_time_formate)}
                `)

                if (one_time_subscription_cost_per_user_for_global_users != null && global_wow_flashcards_id != null) {
                    await dbConnection.query(`
                    update global_wow_flashcards_db.global_wow_flashcards_master
                    set one_time_subscription_cost_per_user_for_global_users =${mysql.escape(null)},
                    one_time_subscription_global_users_currency = ${mysql.escape(null)}
                    where global_wow_flashcards_id = ${mysql.escape(global_wow_flashcards_id)}
                    `)
                }

                // 34_audit_trail_for_monetization_flashcards 
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_monetization_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
                create table ${dbName}.34_audit_trail_for_monetization_flashcards(
                 id int not null auto_increment primary key,
                 entry_type varchar(50),
                 entry_date_time datetime,
                 entry_by_user_id int,
                 global_wow_flashcards_id int,
                 institutional_wow_flashcards_id int
                )
                `)

                    await dbConnection.query(`
                insert into ${dbName}.34_audit_trail_for_monetization_flashcards(
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
        } catch (error) {
            return error;
        }
    }
    // ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices
    async ViewMonetizationHistoryOfYourWOWFlashcardsMonetizationPrices(
        country_code,
        customer_id,
        user_id,
        institutional_wow_flashcards_id
    ) {
        try {
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            const monetization_history = await dbConnection.query(`
            SELECT * FROM ${dbName}.34_userapp_wow_flashcards_monetization_prices
            where institutional_wow_flashcards_id = ${mysql.escape(institutional_wow_flashcards_id)} and entry_by_user_id = ${mysql.escape(user_id)}
            order by effective_from_datetime desc
            `);

            return monetization_history;
        } catch (error) {
            return error;
        }
    }
    // GetAllMonetizationOfYourWowFlashcards
    async GetAllMonetizationOfYourWowFlashcards(
        country_code,
        customer_id,
        user_id,
        currency_code
    ) {
        try {
            // console.log('global');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let userapp_institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            let userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const userapp_institutional_wow_flashcards_collaborators = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_collaborators`
            // console.log(dbName, 'dbName')
            const userapp_wow_flashcards_monetization_prices = `${country_code}_${customer_id}_edu_customer_db.34_userapp_wow_flashcards_monetization_prices`;
            const global_registered_wow_customers_master_data = `global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data`;

            let finalResult: any[] = []
            // let data_of_institutional_study: any[] = [];
            // let data_of_global_course_subject_of_interest: any[] = [];
            let common = async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                let institutional_wow_flashcards_id = fetch_institutional_wow_flashcards_syllabus_linkage;
                let access_hidden = `select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${institutional_wow_flashcards_id}`;
                // console.log(institutional_wow_flashcards_id, 'institutional_wow_flashcards_id')
                await dbConnection.query(`
               ${access_hidden} 
            `).then(async (fetch_institutional_wow_flashcards_master: any) => {
                    // console.log(fetch_institutional_wow_flashcards_master, 'd')
                    if (fetch_institutional_wow_flashcards_master.length > 0) {
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
                        let main = async () => {
                            let monetization_info: any = null
                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_wow_flashcards_monetization_prices`) == 1) {
                                await dbConnection.query(`select * from ${userapp_wow_flashcards_monetization_prices} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id} order by effective_from_datetime desc`).then((res: any) => {
                                    if (res.length > 0) {
                                        monetization_info = { ...res[0] }
                                    }
                                })
                            }
                            let registered_educational_institution_name = await dbConnection.query(`select * from ${global_registered_wow_customers_master_data} where customer_id=${customer_id}`).then((res: any) => {
                                if (res.length > 0) {
                                    return res[0].registered_educational_institution_name
                                }
                                return null
                            })
                            let tds_per_check: any;
                            if (await this.helper.tableExists(`edu_user_apps_common_data_db`, `edu_customers_platform_fees`) == 1) {
                                tds_per_check =
                                    await dbConnection.query(`
                                select tds_percentage from edu_user_apps_common_data_db.edu_customers_platform_fees where customer_country_code = ${mysql.escape(country_code)} order by effective_from_datetime desc limit 1;
                                `)
                            }
                            let inst_flashcards_question_count: any;
                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                inst_flashcards_question_count = await dbConnection.query(`
                                select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                            `)
                            }
                            const flag_date_check =await this.helper.isWithinOneWeek(fetch_institutional_wow_flashcards_master[0]?.flashcards_edited_datetime);
                            finalResult.push(Object.assign(fetch_institutional_wow_flashcards_master[0], {
                                tds_percentage: tds_per_check[0]?.tds_percentage,
                                flag_new_date: flag_date_check,
                                collaborated_user_id,
                                monetization_info,
                                currency_code,
                                registered_educational_institution_name,
                                inst_flashcards_question_count
                            }))
                        }

                        let collaborated_user_id: any;
                        if (fetch_institutional_wow_flashcards_master[0].flashcards_entry_creator_user_id == user_id) {
                            collaborated_user_id = await collaborated_user_info()
                            await main()

                        } else {
                            await dbConnection.query(`
                        select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id=${user_id}
                    `).then(async (data: any) => {
                                if (data.length > 0) {
                                    collaborated_user_id = await collaborated_user_info()
                                    await main()
                                }
                            })
                        }

                    }
                })

            }
            let { institution_study_courses, inst } = await this._cmn.data_share_for_get_all_wow_flashcards(country_code, customer_id, user_id)
            let wth_dub_all_syllabus_ids: any[] = [], wth_out_dub_all_syllabus_ids: any[] = [];
            let wth_dub_all_wow_flashcards_ids: any[] = [], wth_out_dub_all_wow_flashcards_ids: any[] = [];
            const joinedTwoArrays = [...institution_study_courses, ...inst];
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
            wth_out_dub_all_syllabus_ids.push(...new Set(wth_dub_all_syllabus_ids))
            for (let i = 0; i < wth_out_dub_all_syllabus_ids.length; i++) {
                let subject_id = wth_out_dub_all_syllabus_ids[i]
                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                    await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where syllabus_id=${mysql.escape(subject_id)}`).then((res_1: any) => {
                        for (let i = 0; i < res_1.length; i++) {
                            wth_dub_all_wow_flashcards_ids.push(res_1[i].institutional_wow_flashcards_id)
                        }
                    })
                }
            }

            wth_out_dub_all_wow_flashcards_ids.push(...new Set(wth_dub_all_wow_flashcards_ids));
            for (let i = 0; i < wth_out_dub_all_wow_flashcards_ids.length; i++) {
                // console.log(wth_out_dub_all_wow_flashcards_ids[i])
                await common(wth_out_dub_all_wow_flashcards_ids[i])
            }

            return finalResult;

        } catch (error) {
            return error;
        }
    }
    // GetAllEarningDetailsListBasedOnSubjectIds
    async GetAllEarningDetailsListBasedOnSubjectIds(
        country_code,
        customer_id,
        user_id,
        currency_code,
        subject_course
    ) {
        try {
            const institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            const userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const userapp_institutional_wow_flashcards_collaborators = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_collaborators`;
            const wow_flashcards_monetization_user_wise_earnings = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_wise_earnings`;
            // console.log(subject_course, 'subject_course');
            let finalResult: any[] = []
            let common = async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                // console.log(fetch_institutional_wow_flashcards_syllabus_linkage, 'fetch_institutional_wow_flashcards_syllabus_linkage');
                let institutional_wow_flashcards_id = fetch_institutional_wow_flashcards_syllabus_linkage;
                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                    let access_hidden = `select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${institutional_wow_flashcards_id}`
                    await dbConnection.query(`
                       ${access_hidden} 
                    `).then(async (fetch_institutional_wow_flashcards_master: any) => {
                        // console.log(fetch_institutional_wow_flashcards_master, 'd')
                        if (fetch_institutional_wow_flashcards_master.length > 0) {
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
                            let collaborated_user_id: any;
                            let main = async () => {
                                let monetization_earning_info: any;
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_wise_earnings`) == 1) {
                                    // console.log(institutional_wow_flashcards_id, 'institutional_wow_flashcards_id')
                                    await dbConnection.query(`select * from ${wow_flashcards_monetization_user_wise_earnings} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} order by earning_datetime desc`).then(async (res: any) => {
                                        // console.log(res, 'res')
                                        if (res.length > 0) {

                                            let total_shared_split_earning_amount = await dbConnection.query(`select sum(shared_split_earning_amount) as total from ${wow_flashcards_monetization_user_wise_earnings} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id}`).then((res: any) => {
                                                if (res.length > 0) {
                                                    return res[0].total
                                                }
                                                return null
                                            })
                                            monetization_earning_info = {
                                                total_shared_split_earning_amount,
                                                ...res[0]
                                            }
                                            let tds_per_check: any;
                                            if (await this.helper.tableExists(`edu_user_apps_common_data_db`, `edu_customers_platform_fees`) == 1) {
                                                tds_per_check =
                                                    await dbConnection.query(`select tds_percentage from edu_user_apps_common_data_db.edu_customers_platform_fees where customer_country_code = ${mysql.escape(country_code)} order by effective_from_datetime desc limit 1;`)
                                            }
                                            let inst_flashcards_question_count: any;
                                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                                inst_flashcards_question_count = await dbConnection.query(`
                                                select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                            `)
                                            }
                                            const flag_date_check =await this.helper.isWithinOneWeek(fetch_institutional_wow_flashcards_master[0]?.flashcards_edited_datetime);
                                            finalResult.push(Object.assign(fetch_institutional_wow_flashcards_master[0], {
                                                tds_percentage: tds_per_check[0]?.tds_percentage,
                                                flag_new_date: flag_date_check,
                                                collaborated_user_id,
                                                currency_code,
                                                monetization_earning_info,
                                                inst_flashcards_question_count
                                            }))
                                        }
                                    })
                                }
                            }

                            if (fetch_institutional_wow_flashcards_master[0].flashcards_entry_creator_user_id == user_id) {
                                collaborated_user_id = await collaborated_user_info()
                                await main()

                            } else {
                                await dbConnection.query(`
                                select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id=${user_id}
                            `).then(async (data: any) => {
                                    if (data.length > 0) {
                                        collaborated_user_id = await collaborated_user_info()
                                        await main()
                                    }
                                })
                            }


                        }
                    })
                }

            }
            if (subject_course?.subject_course_info?.global_course_subject_id == null) {
                let duplicate_ids: any[] = []
                for (let iterate_subject_id = 0; iterate_subject_id < subject_course.subject_ids.length; iterate_subject_id++) {
                    let subject_id = subject_course.subject_ids[iterate_subject_id];
                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                        await dbConnection.query(`
                          select * from ${institutional_wow_flashcards_syllabus_linkage} 
                          where course_subject_id = ${subject_course.subject_course_info.institutional_course_subject_id} 
                          and syllabus_id=${mysql.escape(subject_id)} and
                          educational_institution_category_country_code=${mysql.escape(subject_course.subject_course_info.educational_institution_category_country_code)} and 
                          educational_institution_category_id=${mysql.escape(subject_course.subject_course_info.educational_institution_category_id)} and is_global = 0 
                         `).then(async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                            // console.log(fetch_institutional_wow_flashcards_syllabus_linkage, 'fetch_institutional_wow_flashcards_syllabus_linkage')
                            if (fetch_institutional_wow_flashcards_syllabus_linkage.length > 0) {
                                for (let i = 0; i < fetch_institutional_wow_flashcards_syllabus_linkage.length; i++) {
                                    duplicate_ids.push(fetch_institutional_wow_flashcards_syllabus_linkage[i].institutional_wow_flashcards_id)
                                }
                            }
                        })

                    }
                }
                let removed_duplicate_ids: any = [...new Set(duplicate_ids)];
                for (let i = 0; i < removed_duplicate_ids.length; i++) {
                    let institutional_wow_flashcards_id = removed_duplicate_ids[i];
                    // console.log(institutional_wow_flashcards_id, 'institutional_wow_resources_id') 
                    await common(institutional_wow_flashcards_id)
                }
            }

            if (subject_course.subject_course_info.global_course_subject_id != null) {
                let duplicate_ids: any[] = []
                for (let iterate_subject_id = 0; iterate_subject_id < subject_course.subject_ids.length; iterate_subject_id++) {
                    let subject_id = subject_course.subject_ids[iterate_subject_id];
                    if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                        await dbConnection.query(`
                          select * from ${institutional_wow_flashcards_syllabus_linkage} where course_subject_id = ${subject_course.subject_course_info.global_course_subject_id} and syllabus_id=${mysql.escape(subject_id)} and
                          educational_institution_category_country_code=${mysql.escape(subject_course.subject_course_info.educational_institution_category_country_code)} and
                          educational_institution_category_id=${mysql.escape(subject_course.subject_course_info.educational_institution_category_id)} and is_global = 1 
                       `).then(async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                            // console.log(fetch_institutional_wow_flashcards_syllabus_linkage, 'fetch_institutional_wow_flashcards_syllabus_linkage')
                            if (fetch_institutional_wow_flashcards_syllabus_linkage.length > 0) {
                                for (let i = 0; i < fetch_institutional_wow_flashcards_syllabus_linkage.length; i++) {
                                    duplicate_ids.push(fetch_institutional_wow_flashcards_syllabus_linkage[i].institutional_wow_flashcards_id)
                                }
                            }
                        })
                    }
                }
                let removed_duplicate_ids: any = [...new Set(duplicate_ids)];
                for (let i = 0; i < removed_duplicate_ids.length; i++) {
                    let institutional_wow_flashcards_id = removed_duplicate_ids[i];
                    // console.log(institutional_wow_flashcards_id,'institutional_wow_flashcards_id') 
                    await common(institutional_wow_flashcards_id)
                }
            }
            // console.log(finalResult, 'finalResult')
            return {
                statusCode: HttpStatus.OK,
                message: ResponseMessageEnum.GET,
                data: finalResult
            }
        } catch (error) {
            throw error;
        }
    }
    // GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails
    async GetAllEarningDetailsListBasedOnBetweenDateFromEarningDetails(
        country_code,
        customer_id,
        institutional_wow_flashcards_id,
        from_date,
        to_date,
    ) {
        try {
            let yearningDetails: any[] = [];
            const from_date_value = this._dateTimeService.formatDate(from_date);
            const to_date_value = this._dateTimeService.formatDate(to_date);
            // console.log(to_date_value,from_date_value,'to_date_value')
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_wise_earnings`) == 1) {

                const weekWiseYearningDetails = await dbConnection.query(`
                                SELECT DATE_FORMAT(earning_datetime, '%Y-%m-%d') as earning_datetime,earning_currency,shared_split_earning_amount
                                 FROM ${dbName}.34_userapp_institutional_wow_flashcards_wise_earnings 
                                where DATE_FORMAT(earning_datetime, '%Y-%m-%d') between ${mysql.escape(from_date_value)} and ${mysql.escape(to_date_value)} and institutional_wow_flashcards_id=${institutional_wow_flashcards_id};`);
                // console.log(weekWiseYearningDetails, 'weekWiseYearningDetails')
                for (let i = 0; i < weekWiseYearningDetails.length; i++) {
                    yearningDetails.push({
                        earning_datetime: weekWiseYearningDetails[i].earning_datetime,
                        earning_amount: weekWiseYearningDetails[i].shared_split_earning_amount,
                        earning_currency: weekWiseYearningDetails[i].earning_currency,
                    });
                }
            }
            // Create an object to store the sum for each date
            const sumByDate = {};

            // Iterate through the earningData and accumulate shared_split_earning_amount
            yearningDetails.forEach((earning) => {
                // console.log(earning, 'earning')
                const date = earning.earning_datetime;
                const currency = earning.earning_currency;
                // Check if the date is already in the sumByDate object, if not, initialize it to 0
                sumByDate[date] = (sumByDate[date] || 0) + parseFloat(earning.earning_amount) , currency;
            });
            const currency = yearningDetails.length > 0 ? yearningDetails[0].earning_currency : 'INR';
            const summedObjects = Object.keys(sumByDate).map((date) => ({
                earning_datetime: date,
                earning_currency: currency, // Assuming the currency is constant
                total_earning_amount: sumByDate[date].toFixed(2) // Round to 2 decimal places
            }));
            return summedObjects;
        } catch (error) {
            return error;
        }
    }
    // GetAllEarningDetailsOfGlobalWowFlashcards
    async GetAllEarningDetailsOfGlobalWowFlashcards(
        country_code,
        customer_id,
        user_id,
        currency_code
    ) {
        try {
            // console.log('global')
            let final: any;
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            let userapp_institutional_wow_flashcards_syllabus_linkage = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_global_syllabus_linkage`;
            let userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const userapp_institutional_wow_flashcards_collaborators = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_collaborators`;
            const wow_flashcards_monetization_user_wise_earnings = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_wise_earnings`

            let finalResult: any[] = []
            let common = async (fetch_institutional_wow_flashcards_syllabus_linkage: any) => {
                let institutional_wow_flashcards_id = fetch_institutional_wow_flashcards_syllabus_linkage;
                let access_hidden = `select * from ${userapp_institutional_wow_flashcards_master} where institutional_wow_flashcards_id =${institutional_wow_flashcards_id}`
                await dbConnection.query(`
                 ${access_hidden} 
              `).then(async (fetch_institutional_wow_flashcards_master: any) => {
                    // console.log(fetch_institutional_wow_flashcards_master, 'd')
                    if (fetch_institutional_wow_flashcards_master.length > 0) {
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
                        let main = async () => {
                            let monetization_earning_info: any;
                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_wise_earnings`) == 1) {
                                await dbConnection.query(`select * from ${wow_flashcards_monetization_user_wise_earnings} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} order by earning_datetime desc`).then(async (res: any) => {
                                    // console.log(res, 'res')
                                    if (res.length > 0) {
                                        let total_shared_split_earning_amount = await dbConnection.query(`select sum(shared_split_earning_amount) as total from ${wow_flashcards_monetization_user_wise_earnings} where institutional_wow_flashcards_id = ${institutional_wow_flashcards_id}`).then((res: any) => {
                                            if (res.length > 0) {
                                                return res[0].total
                                            }
                                            return null
                                        })
                                        monetization_earning_info = {
                                            total_shared_split_earning_amount,
                                            ...res[0]
                                        }
                                        let tds_per_check: any;
                                        if (await this.helper.tableExists(`edu_user_apps_common_data_db`, `edu_customers_platform_fees`) == 1) {
                                            tds_per_check =
                                                await dbConnection.query(`
                                            select tds_percentage from edu_user_apps_common_data_db.edu_customers_platform_fees where customer_country_code = ${mysql.escape(country_code)} order by effective_from_datetime desc limit 1;
                                            `)
                                        }
                                        const flag_date_check =await this.helper.isWithinOneWeek(fetch_institutional_wow_flashcards_master[0]?.flashcards_edited_datetime);
                                        let inst_flashcards_question_count: any;
                                        if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                                            inst_flashcards_question_count = await dbConnection.query(`
                                            select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                        `)
                                        }
                                        finalResult.push(Object.assign(fetch_institutional_wow_flashcards_master[0], {
                                            tds_percentage: tds_per_check[0]?.tds_percentage,
                                            flag_new_date: flag_date_check,
                                            collaborated_user_id,
                                            currency_code,
                                            monetization_earning_info,
                                            inst_flashcards_question_count
                                        }))
                                    }
                                })
                            }

                        }

                        let collaborated_user_id: any;
                        if (fetch_institutional_wow_flashcards_master[0].flashcards_entry_creator_user_id == user_id) {
                            collaborated_user_id = await collaborated_user_info()
                            await main()
                        } else {
                            await dbConnection.query(`
                          select * from ${userapp_institutional_wow_flashcards_collaborators} where institutional_wow_flashcards_id=${institutional_wow_flashcards_id} and collaborator_user_id=${user_id}
                      `).then(async (data: any) => {
                                if (data.length > 0) {
                                    collaborated_user_id = await collaborated_user_info()
                                    await main()
                                }
                            })
                        }


                    }
                })

            }
            let { institution_study_courses, inst } = await this._cmn.data_share_for_get_all_wow_flashcards(country_code, customer_id, user_id)
            let wth_dub_all_syllabus_ids: any[] = [], wth_out_dub_all_syllabus_ids: any[] = [];
            let wth_dub_all_wow_flashcards_ids: any[] = [], wth_out_dub_all_wow_flashcards_ids: any[] = [];
            const joinedTwoArrays = [...institution_study_courses, ...inst];

            for (let i = 0; i < joinedTwoArrays.length; i++) {
                let get_tree_syllabus_details: any;
                if (!joinedTwoArrays[i].hasOwnProperty('institutional_course_subject_id')) Reflect.defineProperty(joinedTwoArrays[i], 'institutional_course_subject_id', { value: undefined, enumerable: true })
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
            wth_out_dub_all_syllabus_ids.push(...new Set(wth_dub_all_syllabus_ids))
            for (let i = 0; i < wth_out_dub_all_syllabus_ids.length; i++) {
                let subject_id = wth_out_dub_all_syllabus_ids[i]
                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                    await dbConnection.query(`select * from ${userapp_institutional_wow_flashcards_syllabus_linkage} where syllabus_id=${mysql.escape(subject_id)}`).then((res_1: any) => {
                        for (let i = 0; i < res_1.length; i++) {
                            wth_dub_all_wow_flashcards_ids.push(res_1[i].institutional_wow_flashcards_id)
                        }
                    })
                }
            }
            // }
            wth_out_dub_all_wow_flashcards_ids.push(...new Set(wth_dub_all_wow_flashcards_ids));
            for (let i = 0; i < wth_out_dub_all_wow_flashcards_ids.length; i++) {
                console.log(wth_out_dub_all_wow_flashcards_ids[i])
                await common(wth_out_dub_all_wow_flashcards_ids[i])
            }
            return finalResult

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
