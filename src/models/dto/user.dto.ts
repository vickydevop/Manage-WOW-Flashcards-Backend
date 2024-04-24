import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CommonFieldsDto } from './common-fields.dto';

export class get_tree_view_data {
  get_tree_view_data:string;
}
export class get_hidden_wow_flashcards_or_update{
  data:string;
}
export class GetTableData {
  data:string;
}
export class resolve_flag_data{
  data:string;
}
export class recommend_teaching_faculty_data{
  data:string;
}
export class linked_syllabus_share_and_unshare{
  data:string;
}
export class list_of_linked_syllabus_add_update_popup{
  data:string
}

export class remove_list_of_linekd_syllabus{
  data:string
}
// Global WOW FlashCards

export class get_table_for_global_wow_flashcards{
  data:string;
}
export class insert_update_flag_data{
  data:string;
}
export class monetization_prices{
  data:string;
}
export class monetization_prices_insert_or_update{
  data:string;
}
export class earning_details_data {
  data:string;
}
// CreateTokenBasedOnResponse 
export class generate_token {
data:any;
}
// get_all_audit_trail_values_based_on_res 
export class get_all_audit_trail_values_based_on_res{
  data:any;
}