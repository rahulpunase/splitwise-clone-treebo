import { IUser, IFriend } from "../db/db";

// export interface IWhenMerged extends IFriend, IUser  {
// 	isChecked: boolean,
// 	whenSplitEquallyAmount: number,
// 	whenSplitDifferentlyAmount: number;
// }

class Utils {
	mergeUserAndFriends(user: IUser | null, friends: Array<IFriend>, totalAmount: string) {
		const _totalAmount = Number(totalAmount);
		if (user) {
			return [...[user], ...friends].map((person, index, self) => {
				return {
					...person,
					isChecked: true,
					whenSplitEquallyAmount: Number((_totalAmount/self.length).toFixed(2)),
					whenSplitDifferentlyAmount: Number((_totalAmount/self.length).toFixed(2)),
				}
			});
		} else {
			return [];
		}
	}

	convertToFixed(number: string | number): number {
		return Number(Number(number).toFixed(2));
	}

	getDividedNumber(number: string | number, numToDivideWith: number): number {
		return this.convertToFixed(number)/numToDivideWith;
	}
}

export default new Utils();
