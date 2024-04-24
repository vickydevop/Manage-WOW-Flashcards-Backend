import { Injectable } from '@nestjs/common';
import { dbConnection } from '../../../app.module';

@Injectable()
export class HelperService {
  // -- Check The Table exist or not -----
  async tableExists(dbName: string, tableName: string): Promise<number> {
    try {
      const tableExists = await dbConnection.query(
        `
        SELECT * 
          FROM information_schema.tables
          WHERE table_schema = '${dbName}'
              AND table_name = '${tableName}'
          LIMIT 1;
        `,
      );

      if (tableExists.length>0) return 1; //TABLE not exist then return true

      return 0; //TABLE exist then return false
    } catch (error) {
      throw error;
    }
  }

  // -- Check The Database exist or not -----
  async dbExists(dbName: string): Promise<number> {
    try {
      const dbExists = await dbConnection.query(
        `
        SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA
        WHERE SCHEMA_NAME = '${dbName}';
        `,
      );

      if (dbExists.length>0) return 1; //TABLE not exist then return true

      return 0; //TABLE exist then return false
    } catch (error) {
      throw error;
    }
  }
  // isWithinOneWeek 
  async isWithinOneWeek(dateString: string): Promise<number> {
    const currentDate = new Date();
    const givenDate = new Date(dateString);
  
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = givenDate.getTime() - currentDate.getTime();
  
    // Calculate the difference in days
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
  
    // Check if the difference is within one week (7 days)
    return Math.abs(differenceInDays) <= 7 ? 1 : 0;
  }
}
