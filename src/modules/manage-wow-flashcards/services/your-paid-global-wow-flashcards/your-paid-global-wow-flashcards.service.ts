import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import { HelperService } from 'src/common/services/helper/helper.service';

@Injectable()
export class YourPaidGlobalWowFlashcardsService {
    constructor(private helper: HelperService) { }

    // GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId 
    async GetAllRecommendedWowGlobalFlashcardsListBasedOnLoginId(
        country_code,
        customer_id,
        user_id
    ) {
        try {
            const userapp_paid_flashcards_of_wow_flashcards_app_users = `${country_code}_${customer_id}_edu_customer_db.34_userapp_payment_status_of_wow_flashcards_app_users`;
            const userapp_institutional_wow_flashcards_master = `${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master`;
            const global_wow_flashcards_master = `global_wow_flashcards_db.global_wow_flashcards_master`;
            let list_of_recommended: any[] = []
            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_payment_status_of_wow_flashcards_app_users`) == 1) {
                await dbConnection.query(`select * from ${userapp_paid_flashcards_of_wow_flashcards_app_users} where paid_by_user_id=${user_id} and is_global_wow_flashcards is not null`).then(async (list_of_recommended_list: any) => {
                    // console.log(list_of_recommended_list, 'list_of_recommended_list')
                    if (list_of_recommended_list.length > 0) {
                        for (let it_recommend = 0; it_recommend < list_of_recommended_list.length; it_recommend++) {
                            let { shared_datetime,
                                is_global_wow_flashcards,
                                global_wow_flashcards_id
                            } = list_of_recommended_list[it_recommend];

                            // console.log(is_global_wow_flashcards[it_recommend])
                            if (is_global_wow_flashcards == false) {
                                let wow_flashcards_thumb_nail_cloud_storage_file_id: any;
                                let wow_flashcards_name: any;
                                let recommended_by_user_info: any;
                                // console.log(`${list_of_recommended_list[it_recommend]}`)
                                if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                                    await dbConnection.query(`select * from ${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master where institutional_wow_flashcards_id =${list_of_recommended_list[it_recommend].institutional_wow_flashcards_id}`).then((res: any) => {
                                        console.log(res,'res')
                                        if (res.length > 0) {
                                            wow_flashcards_thumb_nail_cloud_storage_file_id = res[0]?.wow_flashcards_thumb_nail_cloud_storage_file_id;
                                            wow_flashcards_name = res[0].wow_flashcards_name
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
                            }


                            if (is_global_wow_flashcards == true) {
                                let wow_flashcards_thumb_nail_cloud_storage_file_id: any;
                                let wow_flashcards_name: any;
                                let recommended_by_user_info: any;
                                let institutional_wow_flashcards_id: any;
                                if (await this.helper.tableExists(`global_wow_flashcards_db`, `global_wow_flashcards_master`) == 1) {
                                    await dbConnection.query(`select * from ${global_wow_flashcards_master} where global_wow_flashcards_id=${global_wow_flashcards_id}`).then(async (res: any) => {
                                        if (res.length > 0) {

                                            institutional_wow_flashcards_id = res[0].institutional_wow_flashcards_id;
                                            // wow_flashcards_name = res[0].wow_flashcards_name
                                            if (await this.helper.tableExists(`${country_code}_${customer_id}_edu_customer_db`, `34_userapp_institutional_wow_flashcards_master`) == 1) {
                                                await dbConnection.query(`select * from ${country_code}_${customer_id}_edu_customer_db.34_userapp_institutional_wow_flashcards_master where institutional_wow_flashcards_id =${res[0].institutional_wow_flashcards_id}`).then((res_1: any) => {
                                                    if (res_1.length > 0) {
                                                        console.log(res_1,'institutional_wow_flashcards_id')
                                                        wow_flashcards_name = res_1[0].wow_flashcards_name;
                                                        wow_flashcards_thumb_nail_cloud_storage_file_id = res_1[0]?.wow_flashcards_thumb_nail_cloud_storage_file_id;
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
                                    })

                                }

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
}
