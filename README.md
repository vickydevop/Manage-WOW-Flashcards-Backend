# manage wow flashcards

## Developer Name

bash
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Installation

bash
npm install

## Basic Packages

bash
#orm
$ npm install --save @nestjs/typeorm typeorm mysql2

#swagger
$ npm install --save @nestjs/swagger swagger-ui-express

## Additional Packages

bash
# Validators
$ npm i --save class-validator class-transformer

#luxon
$ npm --save install luxon

# .env config
$ npm i --save @nestjs/config


## Authentication

- JWT Token ( passport )

bash
# passport-jwt
$ npm install --save @nestjs/jwt passport-jwt @nestjs/passport passport

# passport-jwt types
$ npm install --save-dev @types/passport-jwt

- Encrypt

bash
#bcrypt
$ npm install --save bcrypt

#bcrypt types
$ npm install  --save-dev @types/bcrypt

## Running the app

bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

## Test

bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

## Data Base Design File Names

- Database name
- global_edu_customers_and_educational_institutions_db

- Table names

1. globle_registered_wow_customers_master_data
2. in_country_code_educational_institutions_data
3. in_country_code_eduction_instutions_location_map_data

- Database name
- in_manage_get_wow_education_db

- Table names

1. 1_getsterapp_assign_getster_categories_to_camps
2. 1_getsterapp_customers_wow_coordinators_assignment_to_camps
3. 1_getsterapp_waste_paper_purchase_prices
4. 3_getsterapp_12_camp_center_wow_coordinators_performance_rating
5. 3_getsterapp_12_camp_id_empty_bags_distribution
6. in_1_wow_customer_collection_bags_data
7. in_1_wow_customer_user_wise_assigned_data_for_collection_bag

- Database name
- in_9_edu_customer_db

- Table names

1. 2_userapp_registered_users_registered_categories
2. 2_userapp_user_category
3. 3_userapp_parent_student_linkage
4. user_login_data
5. user_profile

- Database name
- manage_getsters_of_get_wow_education_db

- Table names

1. getster_category
2. getster_profile
3. getster_profile_audit_trail
4. registered_users_registered_getster_categories

- Table name and used apis

1. 3_getsterapp_12_camp_id_empty_bags_distribution

https://wastepapercollectionapi.getbiz.app/api/empty-bags-distribution/get-empty-bags-distribution
https://wastepapercollectionapi.getbiz.app/api/empty-bags-distribution/insert-empty-bags
https://wastepapercollectionapi.getbiz.app/api/empty-bags-distribution/update-empty-bags

2. in_1_wow_customer_collection_bags_data

https://wastepapercollectionapi.getbiz.app/api/customer-collection-bags-data/get-collection-bags-data-by-bag-id?customer_id=1&country_code=in&bag_id=1
https://wastepapercollectionapi.getbiz.app/api/customer-collection-bags-data/get-collection-bags-data
https://wastepapercollectionapi.getbiz.app/api/customer-collection-bags-data/update-collection-bags-data-pick-up
https://wastepapercollectionapi.getbiz.app/api/customer-collection-bags-data/get-collection-bags-data-pick-up

3. 1_getsterapp_customers_wow_coordinators_assignment_to_camps

https://wastepapercollectionapi.getbiz.app/api/wow-coordinators-assignment-to-camps/get-collections
https://wastepapercollectionapi.getbiz.app/api/wow-coordinators-assignment-to-camps/get-guideliens
https://wastepapercollectionapi.getbiz.app/api/wow-coordinators-assignment-to-camps/get-coordinator
https://wastepapercollectionapi.getbiz.app/api/coordinators-assignment-to-camps/get-wow-manager-number

4. in_1_wow_customer_user_wise_assigned_data_for_collection_bag

https://wastepapercollectionapi.getbiz.app/api/assigned-data-for-collection-bag/insert-assigned-data
https://wastepapercollectionapi.getbiz.app/api/assigned-data-for-collection-bag/get-selected-assigned-data?bag_id=1&login_id=1
https://wastepapercollectionapi.getbiz.app/api/api/assigned-data-for-collection-bag/delete-selected-assigned-data?user_id=1

5. 3_getsterapp_12_camp_center_wow_coordinators_performance_rating

https://wastepapercollectionapi.getbiz.app/api/wow-coordinators-performance-rating/insert-and-update-gauge-meter
https://wastepapercollectionapi.getbiz.app/api/wow-coordinators-performance-rating/insert-and-update-gauge-meter-miscontent

6. getster_profile_audit_trail

https://wastepapercollectionapi.getbiz.app/api/getster-profile-audit-trail/get-waste-paper-collection-audit-trail?page_no=1&per_page=5

7. 2_userapp_user_category

https://wastepapercollectionapi.getbiz.app/api/users-registered-categories/get-user-category
https://wastepapercollectionapi.getbiz.app/api/users-registered-categories/get-user-category-data?category_id=5011&login_id=1

8.global_registered_wow_customers_master_data

https://wastepapercollectionapi.getbiz.app/api/customers-master-data/get-map-location