import type { DryRunTransactionBlockResponse } from "@mysten/sui.js/client/types/index.js";

export interface BalanceChange {
  /**
   * The amount indicate the balance value changes, negative amount means spending coin value and
   * positive means receiving coin value.
   */
  amount: string;
  coinType: string;
}

export type SuiObjectChange =
  | {
    objectId: string;
    objectType: string;
    type: string;
    version: string;
  }
  | {
    objectId: string;
    objectType: string;
    previousVersion: string;
    type: "mutated";
    version: string;
  };

export interface SenderChange {
  balanceChanges: BalanceChange[];
  objectChanges: SuiObjectChange[];
}

export interface DryRunTransactionBlockResponsePlus {
  senderChange: SenderChange;
  dryRunTransactionBlockResponse: DryRunTransactionBlockResponse;
}

export const parseDryRunResult = (
  res: DryRunTransactionBlockResponse,
): DryRunTransactionBlockResponsePlus => {
  const balanceChanges = res.balanceChanges;
  const objectChanges = res.objectChanges;
  console.log(balanceChanges);

  const sender = res.input.sender;
  const balanceIncrease: BalanceChange[] = [];
  const balanceDecrease: BalanceChange[] = [];

  const moreObjects: SuiObjectChange[] = [];
  const lessObjects: SuiObjectChange[] = [];
  const mutatedObjects: SuiObjectChange[] = [];

  for (const balanceChange of balanceChanges) {
    if (balanceChange.owner.AddressOwner !== sender) {
      continue;
    }
    const newBalanceChange: BalanceChange = {
      amount: balanceChange.amount,
      coinType: balanceChange.coinType,
    };
    if (balanceChange.amount.startsWith("-")) {
      balanceDecrease.push(newBalanceChange);
    } else {
      balanceIncrease.push(newBalanceChange);
    }
  }

  for (const objectChange of objectChanges) {
    if (objectChange.type === "transferred") {
      if (objectChange.sender === objectChange.recipient.AddressOwner) {
        continue;
      }
      if (objectChange.sender === sender) {
        const newObjectChange: SuiObjectChange = {
          objectId: objectChange.objectId,
          objectType: objectChange.objectType,
          type: "Remove",
          version: objectChange.version,
        };
        lessObjects.push(newObjectChange);
      }
      if (objectChange.recipient.AddressOwner === sender) {
        const newObjectChange: SuiObjectChange = {
          objectId: objectChange.objectId,
          objectType: objectChange.objectType,
          type: "Add",
          version: objectChange.version,
        };
        moreObjects.push(newObjectChange);
      }
    }
    if (objectChange.type === "deleted" && objectChange.sender === sender) {
      const newObjectChange: SuiObjectChange = {
        objectId: objectChange.objectId,
        objectType: objectChange.objectType,
        type: "Remove",
        version: objectChange.version,
      };
      lessObjects.push(newObjectChange);
    }
    if (objectChange.type === "created" && objectChange.owner === sender) {
      const newObjectChange: SuiObjectChange = {
        objectId: objectChange.objectId,
        objectType: objectChange.objectType,
        type: "Add",
        version: objectChange.version,
      };
      moreObjects.push(newObjectChange);
    }
    if (objectChange.type === "mutated" && objectChange.owner === sender) {
      const newObjectChange: SuiObjectChange = {
        objectId: objectChange.objectId,
        objectType: objectChange.objectType,
        previousVersion: objectChange.previousVersion,
        type: "mutated",
        version: objectChange.version,
      };
      mutatedObjects.push(newObjectChange);
    }
  }

  const newSenderChange: SenderChange = {
    balanceChanges: balanceDecrease.concat(balanceIncrease),
    objectChanges: lessObjects.concat(moreObjects).concat(mutatedObjects),
  };

  const dryRunTransactionBlockResponsePlus: DryRunTransactionBlockResponsePlus =
    {
      senderChange: newSenderChange,
      dryRunTransactionBlockResponse: res,
    };

  return dryRunTransactionBlockResponsePlus;
};