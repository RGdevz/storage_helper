import path from "path";
import * as fs from 'fs-extra'
import {Mutex} from 'async-mutex';



	 const obj_initiator = {
		array:()=>Array(),
		string:()=>String(),
		number:()=>Number()
	 }



export class storage_helper<database_entries extends Record<string, any>>{



	private mutex = new Mutex()
	private readonly scheme:Record<keyof database_entries, keyof typeof obj_initiator>
	private readonly db_path:string



 constructor(scheme:Record<keyof database_entries, keyof typeof obj_initiator>,db_path?:string) {
 this.scheme = scheme
	this.db_path = db_path || process.cwd()
	}



	 private get_db_path(){
		return path.join(this.db_path,'database.json')
	 }


	  public async get_db():Promise<database_entries>{
		 const the_path = this.get_db_path()

		 await fs.ensureFile(the_path)

			if (!await fs.pathExists(the_path)) throw new Error('failed to create db file')

			try{

			return JSON.parse(await fs.readFile(the_path, 'utf8'))

			}catch (e) {
		/* console.log(e.message ?? e.toString())*/
			}

	 	return Object()

		 }






		private async save_db(db:database_entries){


		await this.mutex.runExclusive(async () => {

		const the_path = this.get_db_path()
		const backup = path.join(the_path,'..','database_bak.json')

		if (await fs.pathExists(the_path)){

	 await fs.copyFile(the_path,backup)
		}

		await fs.writeFile(the_path,JSON.stringify(db),{flag: 'w+'})

		try {
		JSON.parse(await fs.readFile(the_path, 'utf8'))

		}catch (e) {

		//rollback

		console.error('rollback',e.message ?? e.toString())

		await fs.move(backup,the_path,{overwrite:true})

		}
		}
		)

		}








		private init_empty_value(key:keyof database_entries){

		return obj_initiator[this.scheme[key]]()

		}







 	public async get_value<the_key extends keyof database_entries>(key:the_key){

		const db = await this.get_db()
		let value = db[key]

		if (value == undefined){
		//@ts-ignore
		value = this.init_empty_value(key)
		}

		return value

 	}






		public async set_value<the_key extends keyof  database_entries>(key:the_key, value: database_entries[the_key]){

		const db = await this.get_db()
		db[key] = value

		await this.save_db(db)

		}



  }
