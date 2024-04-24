import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import * as mysql from 'mysql2';
import { HelperService } from 'src/common/services/helper/helper.service';
import { CommonRelevantSyllabus } from 'src/common/services/comon-relevant-syllabus/common.service';
import { DateTimeService } from 'src/common/services/date-time/date-time.service';
@Injectable()
export class GlobalWowFlashcardsService {
    constructor(private helper: HelperService, private _cmn: CommonRelevantSyllabus, private _dateTimeService: DateTimeService) { }
    // GetTableDataBasedOnRelevantSyllabusAndSyllabusId
    async GetTableDataBasedOnRelevantSyllabusAndSyllabusId(
        customer_id,
        country_code,
        user_id,
        data
    ) {
        try {
            // console.log(data,'GetTableDataBasedOnRelevantSyllabusAndSyllabusId');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;

            let {
                is_global,
                global_course_subject_id,
                educational_institution_category_country_code,
                educational_institution_category_id
            } = data.receive_data_from_parent_global;

            let course_subject_id: any;
            if (is_global == 1) {
                course_subject_id = global_course_subject_id;
            }
            let table_values: any = [];
            let push_data: any = [];
            if (await this.helper.tableExists(`${dbName}`, `34_userapp_institutional_wow_flashcards_global_syllabus_linkage`) == 1) {
                for (let i = 0; i < data?.syllabus_id.length; i++) {
                    if (data.syllabus_id.length > 0) {
                        const res = await dbConnection.query(`
                        select * from ${dbName}.34_userapp_institutional_wow_flashcards_global_syllabus_linkage
                        where course_subject_id = ${mysql.escape(course_subject_id)} and is_global = ${mysql.escape(is_global)} 
                        and educational_institution_category_country_code = ${mysql.escape(educational_institution_category_country_code)} 
                        and educational_institution_category_id =${mysql.escape(educational_institution_category_id)} 
                        and syllabus_id = ${mysql.escape(data?.syllabus_id[i])} 
                        `)
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res[i],res.length,'erere');
                            push_data.push(res[i])
                        }

                    }
                }
                // console.log(push_data, 'push_data');
                const uniqueFlashcardIds = new Set<number>();
                const uniqueFlashcards = push_data.filter((flashcard) => {
                    if (!uniqueFlashcardIds.has(flashcard.institutional_wow_flashcards_id)) {
                        uniqueFlashcardIds.add(flashcard.institutional_wow_flashcards_id);
                        return true;
                    }
                    return false;
                });
                // console.log(uniqueFlashcards, 'uniqueData', uniqueFlashcards.length)
                for (let k = 0; k < uniqueFlashcards.length; k++) {
                    // console.log(uniqueFlashcards.length, uniqueFlashcards,'dd')
                    const get_global_wow_flashcards_details =
                        await dbConnection.query(`
                        select * from ${dbName}.34_userapp_institutional_wow_flashcards_master 
                        where institutional_wow_flashcards_id = ${mysql.escape(uniqueFlashcards[k]?.institutional_wow_flashcards_id)}
                        `);
                    if (get_global_wow_flashcards_details.length > 0) {
                        // console.log(get_global_wow_flashcards_details,'flag_date',`${dbName}`)
                        const flag_date_check = await this.helper.isWithinOneWeek(get_global_wow_flashcards_details[0]?.flashcards_edited_datetime);
                        Object.defineProperties(uniqueFlashcards[k], {
                            global_wow_flashcards_id: {
                                value: get_global_wow_flashcards_details[0].global_wow_flashcards_id,
                                enumerable: true
                            },
                            wow_flashcards_name: {
                                value: get_global_wow_flashcards_details[0].wow_flashcards_name,
                                enumerable: true
                            },
                            flashcards_edited_datetime: {
                                value: get_global_wow_flashcards_details[0].flashcards_edited_datetime,
                                enumerable: true
                            },
                            wow_flashcards_thumb_nail_cloud_storage_file_id: {
                                value: get_global_wow_flashcards_details[0].wow_flashcards_thumb_nail_cloud_storage_file_id,
                                enumerable: true
                            },
                            is_global: {
                                value: uniqueFlashcards[k].is_global,
                                enumerable: true
                            },
                            institutional_wow_flashcards_id: {
                                value: get_global_wow_flashcards_details[0].institutional_wow_flashcards_id,
                                enumerable: true
                            },
                            flag_new_date: {
                                value: flag_date_check,
                                enumerable: true
                            },
                            flashcards_entry_creator_user_id: {
                                value: get_global_wow_flashcards_details[0].flashcards_entry_creator_user_id,
                                enumerable: true
                            },
                            user_id: {
                                value: user_id,
                                enumerable: true
                            }
                        })
                        // console.log(res[0],'res[0]');
                        let inst_flashcards_question_count: any;
                        if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_${uniqueFlashcards[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details`) == 1) {
                            inst_flashcards_question_count = await dbConnection.query(`
                                        select count(*) as count from ${country_code}_${customer_id}_edu_customer_db.34_userapp_${uniqueFlashcards[k]?.institutional_wow_flashcards_id}_insti_wow_flashcards_id_question_details
                                    `)
                        }
                        Object.defineProperty(uniqueFlashcards[k], 'inst_flashcards_question_count', {
                            value: inst_flashcards_question_count,
                            enumerable: true
                        })
                        if (uniqueFlashcards[k].global_wow_flashcards_id != null) {
                            const get_global_values =
                                await dbConnection.query(`
                                    SELECT * FROM global_wow_flashcards_db.global_wow_flashcards_master 
                                    where global_wow_flashcards_id = ${mysql.escape(uniqueFlashcards[k].global_wow_flashcards_id)}
                                    `);

                            Object.defineProperties(uniqueFlashcards[k], {
                                one_time_subscription_cost_per_user_for_global_users: {
                                    value: get_global_values[0].one_time_subscription_cost_per_user_for_global_users,
                                    enumerable: true
                                },
                                one_time_subscription_global_users_currency: {
                                    value: get_global_values[0].one_time_subscription_global_users_currency,
                                    enumerable: true
                                },
                                up_to_date_total_no_global_users_to_whom_this_is_assigned: {
                                    value: get_global_values[0].up_to_date_total_no_global_users_to_whom_this_is_assigned,
                                    enumerable: true
                                }
                            });

                            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_users_rating`) == 1) {
                                const rating_value = await dbConnection.query(`
                                    select avg(rating) as rating from global_wow_flashcards_db.${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_users_rating 
                                    `)

                                const your_rating_value =
                                    await dbConnection.query(`
                                    select * from global_wow_flashcards_db.${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_users_rating 
                                    where rating_by_user_id = ${mysql.escape(user_id)} order by id desc;
                                    `)
                                Object.defineProperties(uniqueFlashcards[k], {
                                    avg_global_teaching_faculty_rating: {
                                        value: rating_value[0]?.rating,
                                        enumerable: true
                                    },
                                    your_rating: {
                                        value: your_rating_value[0]?.rating,
                                        enumerable: true
                                    }
                                })
                            }

                            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                                const un_resolved_d =
                                    await dbConnection.query(`
                                        select count(*) as count from global_wow_flashcards_db.${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages;
                                        `);

                                const un_resolved_details =
                                    await dbConnection.query(`
                                        select count(*) as count from global_wow_flashcards_db.${uniqueFlashcards[k].global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages where resolved_by_user_id is not null;
                                        `);

                                Object.defineProperties(uniqueFlashcards[k], {
                                    total_count_of_unresolved_flags: {
                                        value: un_resolved_d[0].count,
                                        enumerable: true
                                    },
                                    count_of_resolved_by_user_id: {
                                        value: un_resolved_details[0].count,
                                        enumerable: true
                                    }
                                })
                            }
                        }
                        // console.log(res[0])
                        const name = await this._cmn.get_user_info_by_user_id(country_code, customer_id, user_id, true);
                        //    console.log(name?.f_name,'sdsd');
                        Object.defineProperties(uniqueFlashcards[k], {
                            first_name: {
                                value: name.f_name,
                                enumerable: true
                            },
                            last_name: {
                                value: name.l_name,
                                enumerable: true
                            },
                            ceph_img: {
                                value: name.ceph_img,
                                enumerable: true
                            },
                            category_name: {
                                value: name.category,
                                enumerable: true
                            }
                        })
                        let flagged_details: any = [];
                        if (await this.helper.tableExists(`global_wow_flashcards_db`, `${uniqueFlashcards[k]?.global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {
                            const flag = await dbConnection.query(`
                                        SELECT * FROM global_wow_flashcards_db.${uniqueFlashcards[k]?.global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages 
                                        where flagged_by_user_id = ${mysql.escape(user_id)} and flagged_by_customer_id =${mysql.escape(customer_id)};
                                        `)

                            flagged_details.push(flag[0]);
                        }

                        Object.defineProperty(uniqueFlashcards[k], 'based_on_global_flashcards_flagged_details', {
                            value: flagged_details,
                            enumerable: true
                        })

                        // console.log(res[k],'l');
                        if (uniqueFlashcards[k].global_wow_flashcards_id != null) {
                            table_values.push(uniqueFlashcards[k]);
                        }
                    }
                    // console.log(table_values, 'aasasasasa')
                }
            }
            // console.log(table_values, 'table_values')
            // uniqueData = table_values.filter((value, index, self) => {
            //     console.log(value, index)
            //     return self.findIndex((obj) => obj.global_wow_flashcards_id == value.global_wow_flashcards_id) == index;
            // });
            return table_values;
        } catch (error) {
            // console.log(error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    // InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating
    async InsertOrUpdateBasedOnGlobalWOWFlashcardsIdRating(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        global_wow_flashcards_id,
        rating_value
    ) {
        try {
            var serverLocalDateFormate = this._dateTimeService.getDateTime(time_zone_iana_string);
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // console.log(global_wow_flashcards_id,rating_value,'sjfgduhdhfidfwdhf;');
            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating`) == 1) {
                const check_data =
                    await dbConnection.query(`
                SELECT count(*) as count FROM global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating
                where rating_by_user_id = ${mysql.escape(user_id)} and rating_by_customer_id = ${mysql.escape(customer_id)} 
                and rating_by_country_code_of_customer_id = ${mysql.escape(country_code)};
                `)

                if (check_data[0]?.count == 0) {
                    // console.log('if');
                    await dbConnection.query(`
                    insert into global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating(
                        rating_by_user_id,
                        rating_by_customer_id,
                        rating_by_country_code_of_customer_id,
                        rating   
                    )values(
                        ${mysql.escape(user_id)},
                        ${mysql.escape(customer_id)},
                        ${mysql.escape(country_code)},
                        ${mysql.escape(rating_value)}
                    )
                    `);
                    // 34_audit_trail_for_global_wow_flashcards
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                            entry_type,
                            entry_date_time,
                            entry_by_user_id,
                            global_wow_flashcards_id
                        )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(global_wow_flashcards_id)}
                        )
                        `)
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

                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                            entry_type,
                            entry_date_time,
                            entry_by_user_id,
                            global_wow_flashcards_id
                        )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(global_wow_flashcards_id)}
                        )
                        `)
                    }
                } else {
                    // console.log('else');
                    await dbConnection.query(`
                    update global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating
                    set rating = ${mysql.escape(rating_value)}
                    where rating_by_user_id = ${mysql.escape(user_id)} and rating_by_customer_id = ${mysql.escape(customer_id)} 
                    and rating_by_country_code_of_customer_id = ${mysql.escape(country_code)};
                    `);

                    // 34_audit_trail_for_global_wow_flashcards
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
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
                        create table ${dbName}.34_audit_trail_for_global_wow_flashcards(
                         id int not null auto_increment primary key,
                         entry_type varchar(50),
                         entry_date_time datetime,
                         entry_by_user_id int,
                         global_wow_flashcards_id int,
                         institutional_wow_flashcards_id int
                        )
                        `);

                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
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
            } else {
                // console.log('else');
                await dbConnection.query(`
                    create table global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating(
                    id int not null auto_increment primary key,
                    rating_by_user_id int,
                    rating_by_customer_id int,
                    rating_by_country_code_of_customer_id varchar(3),
                    rating decimal(3)
                    )
                `);

                await dbConnection.query(`
                insert into global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_users_rating(
                    rating_by_user_id,
                    rating_by_customer_id,
                    rating_by_country_code_of_customer_id,
                    rating   
                )values(
                    ${mysql.escape(user_id)},
                    ${mysql.escape(customer_id)},
                    ${mysql.escape(country_code)},
                    ${mysql.escape(rating_value)}
                )
                `)

                // 34_audit_trail_for_global_wow_flashcards
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id,
                        global_wow_flashcards_id
                    )values(
                        'Inserted',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)},
                        ${mysql.escape(global_wow_flashcards_id)}
                    )
                    `)
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

                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id,
                        global_wow_flashcards_id
                    )values(
                        'Inserted',
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
    // InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag
    async InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag(
        customer_id,
        country_code,
        user_id,
        time_zone_iana_string,
        data
    ) {
        try {

            const concatenatedNames = data.flagged_by_user_name.join(' ');
            const dbName = `${country_code}_${customer_id}_edu_customer_db`;
            // Update the data object
            data.flagged_by_user_name = concatenatedNames;

            let {
                flag_message_id,
                global_wow_flashcards_id,
                flag_reason_code,
                flag_details,
                flagged_by_user_name,
                flagged_by_user_category_name
            } = data;

            // console.log(data, 'InsertOrUpdateBasedOnGlobalWOWFlashcardsIdFlag', flag_reason_code?.value);
            var serverLocalDateFormate = this._dateTimeService.getDateTime(
                time_zone_iana_string,
            );

            if (await this.helper.tableExists(`global_wow_flashcards_db`, `${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages`) == 1) {

                const check =
                    await dbConnection.query(`
                SELECT count(*) as count FROM global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages 
                where flagged_by_user_id = ${mysql.escape(user_id)} and flagged_by_customer_id =${mysql.escape(customer_id)};
                `);

                if (check[0].count == 0) {
                    await dbConnection.query(`insert into global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages(
                        flag_reason_code,
                        flag_details,
                        flagged_by_user_id,
                        flagged_by_user_name,
                        flagged_by_user_category_name,
                        flagged_by_customer_id,
                        flagged_by_country_code_of_customer_id,
                        flagged_datetime
                    )values(
                        ${mysql.escape(flag_reason_code)},
                        ${mysql.escape(flag_details)},
                        ${mysql.escape(user_id)},
                        ${mysql.escape(flagged_by_user_name)},
                        ${mysql.escape(flagged_by_user_category_name)},
                        ${mysql.escape(customer_id)},
                        ${mysql.escape(country_code)},
                        ${mysql.escape(serverLocalDateFormate)}
                    )
                    `);
                    // 34_audit_trail_for_global_wow_flashcards
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                            entry_type,
                            entry_date_time,
                            entry_by_user_id,
                            global_wow_flashcards_id
                        )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(global_wow_flashcards_id)}
                        )
                        `)
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

                        await dbConnection.query(`
                        insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                            entry_type,
                            entry_date_time,
                            entry_by_user_id,
                            global_wow_flashcards_id
                        )values(
                            'Inserted',
                            ${mysql.escape(serverLocalDateFormate)},
                            ${mysql.escape(user_id)},
                            ${mysql.escape(global_wow_flashcards_id)}
                        )
                        `)
                    }
                } else {
                    await dbConnection.query(`
                 update global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages 
                 set flag_reason_code = ${mysql.escape(flag_reason_code)},
                 flag_details = ${mysql.escape(flag_details)}
                 where flag_message_id = ${mysql.escape(flag_message_id)} and flagged_by_customer_id = ${mysql.escape(customer_id)}
                 `);
                    // 34_audit_trail_for_global_wow_flashcards
                    if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
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
                    create table ${dbName}.34_audit_trail_for_global_wow_flashcards(
                     id int not null auto_increment primary key,
                     entry_type varchar(50),
                     entry_date_time datetime,
                     entry_by_user_id int,
                     global_wow_flashcards_id int,
                     institutional_wow_flashcards_id int
                    )
                    `);

                        await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
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
            } else {
                await dbConnection.query(`
                create table global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages (
                    flag_message_id int not null auto_increment primary key,
                    flag_reason_code smallint,
                    flag_details longtext,
                    flagged_by_user_id int,
                    flagged_by_user_name varchar(50),
                    flagged_by_user_category_name varchar(75),
                    flagged_by_customer_name varchar(75),
                    flagged_by_customer_id int,
                    flagged_by_country_code_of_customer_id varchar(3),
                    flagged_datetime datetime,
                    resolved_comments longtext,
                    resolved_by_user_id int,
                    resolved_datetime datetime
                    )
                `);

                await dbConnection.query(`insert into global_wow_flashcards_db.${global_wow_flashcards_id}_global_wow_flashcards_id_flagged_messages(
                    flag_reason_code,
                    flag_details,
                    flagged_by_user_id,
                    flagged_by_user_name,
                    flagged_by_user_category_name,
                    flagged_by_customer_id,
                    flagged_by_country_code_of_customer_id,
                    flagged_datetime
                )values(
                    ${mysql.escape(flag_reason_code)},
                    ${mysql.escape(flag_details)},
                    ${mysql.escape(user_id)},
                    ${mysql.escape(flagged_by_user_name)},
                    ${mysql.escape(flagged_by_user_category_name)},
                    ${mysql.escape(customer_id)},
                    ${mysql.escape(country_code)},
                    ${mysql.escape(serverLocalDateFormate)}
                )
                `)
                // 34_audit_trail_for_global_wow_flashcards
                if (await this.helper.tableExists(`${dbName}`, `34_audit_trail_for_global_wow_flashcards`) == 1) {
                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id,
                        global_wow_flashcards_id
                    )values(
                        'Inserted',
                        ${mysql.escape(serverLocalDateFormate)},
                        ${mysql.escape(user_id)},
                        ${mysql.escape(global_wow_flashcards_id)}
                    )
                    `)
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

                    await dbConnection.query(`
                    insert into ${dbName}.34_audit_trail_for_global_wow_flashcards(
                        entry_type,
                        entry_date_time,
                        entry_by_user_id,
                        global_wow_flashcards_id
                    )values(
                        'Inserted',
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
}
