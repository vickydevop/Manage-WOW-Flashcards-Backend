import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { YourWowFlashcardsController } from "./controllers/your-wow-flashcards/your-wow-flashcards.controller";
import { GlobalWowFlashcardsController } from "./controllers/global-wow-flashcards/global-wow-flashcards.controller";
import { AssignWowFlashcardsToStudentsController } from "./controllers/assign-wow-flashcards-to-students/assign-wow-flashcards-to-students.controller";
import { MonetizationOfYourWowFlashcardsController } from "./controllers/monetization-of-your-wow-flashcards/monetization-of-your-wow-flashcards.controller";
import { RecommendedWowFlashcardsFromOtherTeachingFacultyController } from "./controllers/recommended-wow-flashcards-from-other-teaching-faculty/recommended-wow-flashcards-from-other-teaching-faculty.controller";
import { YourPaidGlobalWowFlashcardsController } from "./controllers/your-paid-global-wow-flashcards/your-paid-global-wow-flashcards.controller";
import { YourWowFlashcardsService } from "./services/your-wow-flashcards/your-wow-flashcards.service";
import { GlobalWowFlashcardsService } from "./services/global-wow-flashcards/global-wow-flashcards.service";
import { AssignWowFlashcardsToStudentsService } from "./services/assign-wow-flashcards-to-students/assign-wow-flashcards-to-students.service";
import { MonetizationOfYourWowFlashcardsService } from "./services/monetization-of-your-wow-flashcards/monetization-of-your-wow-flashcards.service";
import { RecommendedWowFlashcardsFromOtherTeachingFacultyService } from "./services/recommended-wow-flashcards-from-other-teaching-faculty/recommended-wow-flashcards-from-other-teaching-faculty.service";
import { AuthenticationController } from "./controllers/authentication/authentication.controller";
import { HelperService } from "src/common/services/helper/helper.service";
import { DateTimeService } from "src/common/services/date-time/date-time.service";
import { CommonRelevantSyllabus } from "src/common/services/comon-relevant-syllabus/common.service";
import { YourPaidGlobalWowFlashcardsService } from "./services/your-paid-global-wow-flashcards/your-paid-global-wow-flashcards.service";

@Module
    ({
        imports: [AuthModule],
        controllers: [
            AuthenticationController,
            YourWowFlashcardsController,
            GlobalWowFlashcardsController,
            AssignWowFlashcardsToStudentsController,
            MonetizationOfYourWowFlashcardsController,
            RecommendedWowFlashcardsFromOtherTeachingFacultyController,
            YourPaidGlobalWowFlashcardsController
        ],
        providers: [
            HelperService,
            DateTimeService,
            CommonRelevantSyllabus,
            YourWowFlashcardsService,
            GlobalWowFlashcardsService,
            AssignWowFlashcardsToStudentsService,
            MonetizationOfYourWowFlashcardsService,
            RecommendedWowFlashcardsFromOtherTeachingFacultyService,
            YourWowFlashcardsService,
            YourPaidGlobalWowFlashcardsService
        ]
    })

export class ManageWOWFlashcardsAppModule {

}