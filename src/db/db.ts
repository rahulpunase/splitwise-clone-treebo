import Dexei, {Collection, PromiseExtended} from "dexie";

class DbHandler {
	private readonly db: Dexei;
	private readonly TABLE_USER = 'users';
	private readonly TABLE_LOGGED_IN_USERS = 'loggedInUsers';
	private readonly TABLE_FRIENDS = 'friends';
	constructor(dbName: string) {
		this.db = new Dexei(dbName);
		this.createTables();
	}

	getDb(): Dexei {
		return this.db;
	}

	createUser(username: string, password: string): PromiseExtended {
		return this.getDb().table(this.TABLE_USER).add({
			id: this.generateId(),
			username: username,
			password: password
		});
	}

	fetchUserByUserName(username: string): Promise<any[]> {
		return this.getDb().table(this.TABLE_USER)
			.where("username").equals(username).toArray();
	}

	loginUser(userId: string): PromiseExtended {
		return this.getDb().table(this.TABLE_LOGGED_IN_USERS).add({
			id: this.generateId(),
			loggedInUserId: userId,
		});
	}

	fetchUserByUserId(userId: string): Promise<any[]> {
		return this.getDb().table(this.TABLE_USER)
			.where("id").equals(userId).toArray();
	}

	fetchLoggedInUser(): Promise<any[]> {
		return this.getDb().table(this.TABLE_LOGGED_IN_USERS)
			.toArray();
	}

	createFriends(userId: string | null, friendName: string): PromiseExtended {
		return this.getDb().table(this.TABLE_FRIENDS).add({
			id: this.generateId(),
			userId: userId,
			friendName: friendName
		});
	}

	fetchFriendsFromUserId(userId: string): Promise<any[]> {
		return this.getDb().table(this.TABLE_FRIENDS)
			.where("userId").equals(userId).toArray();
	}

	private createTables(): void {
		this.getDb().version(3).stores({
			[this.TABLE_USER]: 'id, username, password',
			[this.TABLE_LOGGED_IN_USERS]: 'id, loggedInUserId',
			[this.TABLE_FRIENDS]: 'id, userId, friendName',
		});
	}

	private generateId(): string {
		return Math.random().toString(16).slice(2)
	}
}

export default new DbHandler('splitwise-db');
