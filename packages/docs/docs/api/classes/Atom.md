---
id: "Atom"
title: "Class: Atom<T>"
sidebar_label: "Atom"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`Synergy`](Synergy.md)<[`T`]\>

  ↳ **`Atom`**

## Constructors

### constructor

• **new Atom**<`T`\>(`defaultValue`, `name?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue` | `T` |
| `name?` | `string` |

#### Overrides

[Synergy](Synergy.md).[constructor](Synergy.md#constructor)

#### Defined in

[atom.ts:7](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/atom.ts#L7)

## Properties

### atoms

• `Readonly` **atoms**: [`AtomTuple`](../modules.md#atomtuple)<[`T`]\>

#### Inherited from

[Synergy](Synergy.md).[atoms](Synergy.md#atoms)

#### Defined in

[synergy.ts:17](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L17)

___

### defaultValue

• `Readonly` **defaultValue**: `T`

___

### id

• `Readonly` **id**: `symbol`

#### Defined in

[atom.ts:5](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/atom.ts#L5)

___

### name

• `Optional` `Readonly` **name**: `string`

## Methods

### combine

▸ **combine**<`R`\>(...`otherSynergies`): [`Synergy`](Synergy.md)<[`T`, ...Flatten<R, []\>[]]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...otherSynergies` | [`SynergyTuple`](../modules.md#synergytuple)<`R`\> |

#### Returns

[`Synergy`](Synergy.md)<[`T`, ...Flatten<R, []\>[]]\>

#### Inherited from

[Synergy](Synergy.md).[combine](Synergy.md#combine)

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
| `handler` | (...`args`: `A`) => (...`drafts`: [`DraftTuple`](../modules.md#drafttuple)<[`T`]\>) => `void` \| `Promise`<`void`\> |

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

#### Inherited from

[Synergy](Synergy.md).[createAction](Synergy.md#createaction)

#### Defined in

[synergy.ts:54](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L54)

___

### createProviderState

▸ **createProviderState**(): `Record`<`symbol`, [`AtomContextData`](../interfaces/AtomContextData.md)<`T`\>\>

**`internal`**

#### Returns

`Record`<`symbol`, [`AtomContextData`](../interfaces/AtomContextData.md)<`T`\>\>

#### Inherited from

[Synergy](Synergy.md).[createProviderState](Synergy.md#createproviderstate)

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
| `selectorFn` | (...`args`: [`T`]) => `R` |

#### Returns

`fn`

▸ (): `any`

##### Returns

`any`

#### Inherited from

[Synergy](Synergy.md).[createSelector](Synergy.md#createselector)

#### Defined in

[synergy.ts:37](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L37)

___

### useSet

▸ **useSet**(): (...`args`: [`T`]) => `Promise`<`void`\>

#### Returns

`fn`

▸ (...`args`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`T`] |

##### Returns

`Promise`<`void`\>

#### Inherited from

[Synergy](Synergy.md).[useSet](Synergy.md#useset)

#### Defined in

[synergy.ts:119](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L119)

___

### useValue

▸ **useValue**(): `any`

#### Returns

`any`

#### Inherited from

[Synergy](Synergy.md).[useValue](Synergy.md#usevalue)

#### Defined in

[synergy.ts:115](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/synergy.ts#L115)
