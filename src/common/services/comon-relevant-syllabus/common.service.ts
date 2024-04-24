import { Injectable } from "@nestjs/common";
import { dbConnection } from "src/app.module";
import * as mysql from 'mysql2';
import { HelperService } from "../helper/helper.service";

@Injectable()
export class CommonRelevantSyllabus {
  constructor(private helper: HelperService) { }
  async data_share_for_get_all_wow_flashcards(country_code, customer_id, user_id) {

    let institution_study_courses: any[] = []
    let institution: any[] = [];
    const dbName = `${country_code}_${customer_id}_edu_customer_db`;
    // console.log(dbName, 'dbName')
    const userapp_schedule_wise_teaching_faculty_and_location = `${dbName}.35_userapp_schedule_wise_teaching_faculty_and_location`;
    const userapp_student_user_category_wise_assigned_courses_subjects = `${dbName}.30_userapp_student_user_category_wise_assigned_courses_subjects`;
    const userapp_institutional_study_subjects_courses = `${dbName}.30_userapp_institutional_study_subjects_courses`;
    const userapp_institutional_study_subjects_courses_details = `${dbName}.30_userapp_institutional_study_subjects_courses_details`;
    const educational_institutions_categories = `edu_user_app_db.educational_institutions_categories`;
    const default_global_subjects_courses_for_educational_Inst_categories = `edu_user_apps_common_data_db.default_global_subjects_courses_for_educational_Inst_categories`;
    const global_registered_wow_customers_master_data = 'global_edu_customers_and_educational_institutions_db.global_registered_wow_customers_master_data';
    const userapp_user_category_wise_academic_year_terms_semesters = `${dbName}.30_userapp_user_category_wise_academic_year_terms_semesters`
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
          // console.log(education_institution_info, 'education_institution_info')
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

    // console.log(institution_study_courses, 'institution_study_courses');

    return {
      institution_study_courses,
      inst
    }
  }


  get_user_info_by_user_id = (async function (country_code: string, customer_id: any, user_id: any, is_need_cat: boolean = true) {
    let userapp_registered_users_registered_categories = `${country_code}_${customer_id}_edu_customer_db.2_userapp_registered_users_registered_categories`;
    let user_profile = `${country_code}_${customer_id}_edu_customer_db.user_profile`;
    let user_info: any = { user_id };
    let userapp_user_category = `${country_code}_${customer_id}_edu_customer_db.2_userapp_user_category`;
    let user_all_cat: any[] = []
    await dbConnection.query(
      `SELECT 
           a.*,
           b.user_category_id FROM ${user_profile} a inner join 
           ${userapp_registered_users_registered_categories} b
           on a.user_id = b.user_id
           where a.user_id=${user_id};
           `
    ).then(async (user_profile_info: any) => {
      for (let u_itm = 0; u_itm < user_profile_info.length; u_itm++) {
        let { user_category_id } = user_profile_info[u_itm],
          user_category_id_vol: any = user_category_id;
        let { first_name, last_name, previous_login_image_of_the_day_ceph_object_id } = user_profile_info[0]
        Object.defineProperties(user_info, {
          f_name: { value: first_name, enumerable: true },
          l_name: { value: last_name, enumerable: true },
          ceph_img: { value: previous_login_image_of_the_day_ceph_object_id, enumerable: true },
        })
        if (is_need_cat) {
          let category_table_length = await dbConnection.query(`select * from ${userapp_user_category}`);
          let result1_vol = user_category_id_vol;
          let AlldataforStudent: any[] = [];
          for (let i = 0; i < category_table_length.length; i++) {
            let result_vol = await dbConnection.query(`SELECT * FROM ${userapp_user_category} where user_category_id=${mysql.escape(result1_vol)}`);
            if (result_vol.length > 0) {
              result1_vol = result_vol[0].parent_user_category_id;
              AlldataforStudent.push(result_vol[0].user_category_name);
            }
          }
          user_all_cat.push(AlldataforStudent.reverse().toString().replace(/,/g, '/'))
        }
      }
    })
    Reflect.defineProperty(user_info, 'category', { value: user_all_cat.toString(), enumerable: true })
    return user_info
  })
}