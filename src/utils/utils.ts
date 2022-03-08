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
					whenSplitEquallyAmount: (_totalAmount/self.length).toFixed(2).toString(),
					whenSplitDifferentlyAmount: (_totalAmount/self.length).toFixed(2).toString(),
				}
			});
		} else {
			return [];
		}
	}

	convertToFixed(number: string | number): string {
		return Number(number).toFixed(2);
	}

	getDividedNumber(number: string | number, numToDivideWith: number): number {
		return Number(this.convertToFixed(number))/numToDivideWith;
	}
}

export default new Utils();
