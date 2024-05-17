# DryRunTransactionBlockResponsePlus

This feature facilitates the extraction of pertinent transaction details, enabling users to assess the implications of transactions on their own accounts and, consequently, improve their security measures.  

The process involves scrutinizing the output from [Sui](https://sui.io/)'s native simulation of transaction execution to isolate details pertinent to the transaction originator. These details are then encapsulated within the `senderChange` attribute, culminating in the assembly of the enhanced `DryRunTransactionBlockResponsePlus` data structure.

```typescript
export interface DryRunTransactionBlockResponsePlus {
  senderChange: SenderChange;
  dryRunTransactionBlockResponse: DryRunTransactionBlockResponse;
}
```

Displaying the `DryRunTransactionBlockResponsePlus.SenderChange` details prominently within the **wallet** application enables users to easily foresee the effects of transactions on their accounts.

------

这是提取交易相关信息的辅助功能，帮助用户分析交易对自己账户的影响，从而提升安全性。  

分析[Sui](https://sui.io/)原本的模拟执行交易返回的数据，提取出跟交易发起者相关的信息，作为`senderChange`属性，构建`DryRunTransactionBlockResponsePlus`数据格式。
```typescript
export interface DryRunTransactionBlockResponsePlus {
  senderChange: SenderChange;
  dryRunTransactionBlockResponse: DryRunTransactionBlockResponse;
}
```
在钱包应用中，优先展示`DryRunTransactionBlockResponsePlus.SenderChange`的信息能帮助用户预览交易对自己账户的影响。
