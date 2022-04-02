---
id: "Synergy"
title: "Class: Synergy<T>"
sidebar_label: "Synergy"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

## Hierarchy

- **`Synergy`**

  ↳ [`Atom`](Atom.md)

## Constructors

### constructor

• **new Synergy**<`T`\>(`atoms`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `atoms` | `any` |

#### Defined in

[synergy.ts:19](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L19)

## Properties

### atoms

• `Readonly` **atoms**: [`AtomTuple`](../modules.md#atomtuple)<`T`\>

#### Defined in

[synergy.ts:17](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L17)

## Methods

### combine

▸ **combine**<`R`\>(...`otherSynergies`): [`Synergy`](Synergy.md)<[...T[], ...Flatten<R, []\>[]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...otherSynergies` | [`SynergyTuple`](../modules.md#synergytuple)<`R`\> |

#### Returns

[`Synergy`](Synergy.md)<[...T[], ...Flatten<R, []\>[]]\>

#### Defined in

[synergy.ts:29](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L29)

___

### createAction

▸ **createAction**<`A`\>(`handler`): () => (...`args`: `A`) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | (...`args`: `A`) => (...`drafts`: [`DraftTuple`](../modules.md#drafttuple)<`T`\>) => `void` \| `Promise`<`void`\> |

#### Returns

`fn`

▸ (): (...`args`: `A`) => `Promise`<`void`\>

##### Returns

`fn`

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `A` |

##### Returns

`Promise`<`void`\>

#### Defined in

[synergy.ts:54](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L54)

___

### createProviderState

▸ **createProviderState**(): `Record`<`symbol`, [`AtomContextData`](../interfaces/AtomContextData.md)<`T`[`number`]\>\>

**`internal`**

#### Returns

`Record`<`symbol`, [`AtomContextData`](../interfaces/AtomContextData.md)<`T`[`number`]\>\>

#### Defined in

[synergy.ts:102](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L102)

___

### createSelector

▸ **createSelector**<`R`\>(`selectorFn`): () => `any`

#### Type parameters

| Name |
| :------ |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectorFn` | (...`args`: `T`) => `R` |

#### Returns

`fn`

▸ (): `any`

##### Returns

`any`

#### Defined in

[synergy.ts:37](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L37)

___

### useSet

▸ **useSet**(): (...`args`: `T`) => `Promise`<`void`\>

#### Returns

`fn`

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` |

##### Returns

`Promise`<`void`\>

#### Defined in

[synergy.ts:119](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L119)

___

### useValue

▸ **useValue**(): `any`

#### Returns

`any`

#### Defined in

[synergy.ts:115](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L115)
