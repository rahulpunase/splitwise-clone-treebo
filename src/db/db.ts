import Dexei, {Collection, PromiseExtended} from "dexie";

export interface IFriend {
	id: string;
	userId: string
	name: string;
	createdAt: Date;
}

export interface IFriendToAddToDb extends IFriend {
	amountTheyOwe: string
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
	private readonly TABLE_EXPENSES_FRIENDS = 'expenses_friends';
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

	addCreateExpenseEntry(friends: Array<IFriendToAddToDb>,
		totalAmount: string, description: string, createdBy: string, type: string): PromiseExtended {
		return this.getDb().table(this.TABLE_EXPENSES).add({
			id: DbHandler.generateId(),
			createdBy: createdBy,
			totalAmount: totalAmount,
			description: description,
			noOfFriends: friends.length,
			isSettled: false,
			type: type,
			createAt: new Date()
		}).then((expenseId) => {
			return this.getDb().table(this.TABLE_EXPENSES_FRIENDS).bulkAdd(friends.map(friends => ({
				id: DbHandler.generateId(),
				userId: friends.id,
				amountTheyOwe: friends.amountTheyOwe,
				expenseId: expenseId,
				isSettled: false,
				createAt: new Date()
			})))
		});
	}

	private createTables(): void {
		this.getDb().version(3).stores({
			[this.TABLE_USER]: 'id, name, username, password, createdAt',
			[this.TABLE_FRIENDS]: 'id, userId, name, createdAt',
			[this.TABLE_EXPENSES]: 'id, createdBy, totalAmount, description, noOfFriends, isSettled, type, createdAt',
			[this.TABLE_EXPENSES_FRIENDS]: 'id, userId, amountTheyOwe, expenseId, isSettled, createdAt',
		});
	}

	private static generateId(): string {
		return Math.random().toString(16).slice(2)
	}
}

export default new DbHandler('splitwise-db');
