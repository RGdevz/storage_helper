import path from "path";
import * as atomically from 'atomically'
import {ensureFile,pathExists,copyFile,move} from 'fs-extra'




	 const objInitiator = {
		array:()=>Array(),
		string:()=>String(),
		number:()=>Number()
	 }




export class storage_helper<databaseEntries extends Record<string, any>>{

	private readonly scheme:Record<keyof databaseEntries, keyof typeof objInitiator>
	private readonly databaseFilePath:string


 constructor(scheme:Record<keyof databaseEntries, keyof typeof objInitiator>, dataPath:string) {
 this.scheme = scheme
	if (!dataPath) throw new Error('no database file path')
	this.databaseFilePath = dataPath
	}



	 public getDBPath(){
		return path.join(this.databaseFilePath,'database.json')
	 }



	  public async getDatabase():Promise<databaseEntries>{
		 const the_path = this.getDBPath()

		 await ensureFile(the_path)

			if (!await pathExists(the_path)) throw new Error('failed to create db file')

			try{

			return JSON.parse(await atomically.readFile(the_path, 'utf8'))

			}catch (e) {
		 /*console.log('[Warning from storage_helper]',e?.message ?? e.toString())*/
			}

	 	return Object()

		 }






		private async saveDatabase(db:databaseEntries){

		const the_path = this.getDBPath()

		await atomically.writeFile(the_path,JSON.stringify(db))

		}








		private initEmptyValue(key:keyof databaseEntries){

		return objInitiator[this.scheme[key]]()

		}







 	public async getValue<the_key extends keyof databaseEntries>(key:the_key){

		const db = await this.getDatabase()
		let value = db[key]

		if (value == undefined){
		//@ts-ignore
		value = this.initEmptyValue(key)
		}

		return value

 	}






		public async setValue<the_key extends keyof  databaseEntries>(key:the_key, value: databaseEntries[the_key]){

		const db = await this.getDatabase()
		db[key] = value

		await this.saveDatabase(db)

		}



  }
