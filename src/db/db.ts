import Dexei, {Collection, PromiseExtended} from "dexie";

export interface IFriend {
	id: string;
	userId: string
	name: string;
	createdAt: Date;
}

export interface IUser {
	id: string;
	username: string
	name: string;
	password: string;
	createdAt: Date;
}



class DbHandler {
	private readonly db: Dexei;
	private readonly TABLE_USER = 'users';
	private readonly TABLE_FRIENDS = 'friends';
	private readonly TABLE_EXPENSES = 'expenses';
	constructor(dbName: string) {
		this.db = new Dexei(dbName);
		this.createTables();
	}

	getDb(): Dexei {
		return this.db;
	}

	createUser({name, username, password}: any): PromiseExtended {
		console.log(arguments);
		return this.getDb().table(this.TABLE_USER).add({
			id: DbHandler.generateId(),
			name: name,
			username: username,
			password: password,
			createdAt: new Date()
		});
	}

	fetchUserByUserName(username: string): Promise<IUser[]> {
		return this.getDb().table(this.TABLE_USER)
			.where("username").equals(username).toArray();
	}

	// loginUser(userId: string): PromiseExtended {
	// 	return this.getDb().table(this.TABLE_LOGGED_IN_USERS).add({
	// 		id: DbHandler.generateId(),
	// 		loggedInUserId: userId,
	// 	});
	// }

	fetchUserByUserId(userId: string): Promise<IUser[]> {
		return this.getDb().table(this.TABLE_USER)
			.where("id").equals(userId).toArray();
	}

	createFriends(userId: string | null, friendName: string): PromiseExtended {
		return this.getDb().table(this.TABLE_FRIENDS).add({
			id: DbHandler.generateId(),
			userId: userId,
			name: friendName,
			createdAt: new Date()
		});
	}

	fetchFriendsFromUserId(userId: string): Promise<IFriend[]> {
		return this.getDb().table(this.TABLE_FRIENDS)
			.where("userId").equals(userId).toArray();
	}

	fetchFriendFromId(id: string): Promise<IFriend[]> {
		return this.getDb().table(this.TABLE_FRIENDS)
			.where("id").equals(id).toArray();
	}

	private createTables(): void {
		this.getDb().version(2).stores({
			[this.TABLE_USER]: 'id, name, username, password, createdAt',
			[this.TABLE_FRIENDS]: 'id, userId, name, createdAt',
			[this.TABLE_EXPENSES]: 'id, createdBy, totalAmount, noOfFriends, isSettled, createdAt',
		});
	}

	private static generateId(): string {
		return Math.random().toString(16).slice(2)
	}
}

export default new DbHandler('splitwise-db');
