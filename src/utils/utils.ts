import {IFriend, IUser} from "../db/db";

class Utils {
	mergeUserAndFriends(user: IUser | null, friends: Array<IFriend>, totalAmount: string) {
		const _totalAmount = Number(totalAmount);
		if (user) {
			return [...[user], ...friends].map((person, index, self) => {
				return {
					...person,
					isChecked: true,
					amountTheyGave: (_totalAmount / self.length).toFixed(2).toString(),
				}
			});
		} else {
			return [];
		}
	}

	convertToFixed(number: string | number): string {
		return Number(number).toFixed(2);
	}

	getDividedNumber(number: string | number, numToDivideWith: number): string {
		return (Number(this.convertToFixed(number)) / numToDivideWith).toString();
	}

	getAmountToSettle(totalAmount: string, totalSummedAmount: number): string {
		return Math.floor((Number(totalAmount) - Math.floor(totalSummedAmount))).toFixed(2);
	}

	formatDate(date: Date): string {
		if (!date) {
			return "";
		}
		return `${date.toLocaleString()}`
	}

	getTotalSumOfFriends(friends: any[]): number {
		return friends.map(friend => Number(friend.amountTheyGave))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
	}
}

export default new Utils();
