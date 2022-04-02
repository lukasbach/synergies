---
id: "modules"
title: "synergies"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [Atom](classes/Atom.md)
- [Synergy](classes/Synergy.md)

## Interfaces

- [AtomContextData](interfaces/AtomContextData.md)
- [MiddlewareProviderProps](interfaces/MiddlewareProviderProps.md)
- [ProviderContextValue](interfaces/ProviderContextValue.md)
- [ProviderProps](interfaces/ProviderProps.md)

## References

### Provider

Renames and re-exports [SynergyProvider](modules.md#synergyprovider)

## Type aliases

### AtomDraft

Ƭ **AtomDraft**<`T`\>: `Draft`<{ `current`: `T` ; `trigger`: () => `WritableDraft`<{ `current`: `T` ; `trigger`: () => `WritableDraft`<{ current: T; trigger: () =\> WritableDraft<...\>; }\>  }\>  }\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types.ts:35](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L35)

___

### AtomTuple

Ƭ **AtomTuple**<`T`\>: { [I in keyof T]: Atom<T[I]\> } & { `length`: `T`[``"length"``]  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [...any[]] |

#### Defined in

[types.ts:6](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L6)

___

### AtomWithValueArray

Ƭ **AtomWithValueArray**<`T`\>: { [I in keyof T]: Object } & { `length`: `T`[``"length"``]  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

#### Defined in

[types.ts:52](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L52)

___

### DraftTuple

Ƭ **DraftTuple**<`T`\>: { [I in keyof T]: AtomDraft<T[I]\> } & { `length`: `T`[``"length"``]  } & `any`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [...any[]] |

#### Defined in

[types.ts:10](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L10)

___

### Flatten

Ƭ **Flatten**<`Arr`, `Result`\>: `Arr` extends readonly [] ? `Result` : `Arr` extends readonly [infer Head, ...infer Tail] ? `Head` extends `ReadonlyArray`<`any`\> ? [`Flatten`](modules.md#flatten)<readonly [...Head, ...Tail], `Result`\> : [`Flatten`](modules.md#flatten)<`Tail`, readonly [...Result, `Head`]\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Arr` | extends `ReadonlyArray`<`unknown`\> |
| `Result` | extends `ReadonlyArray`<`unknown`\> = [] |

#### Defined in

[types.ts:18](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L18)

___

### Listener

Ƭ **Listener**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[types.ts:40](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L40)

___

### Middleware

Ƭ **Middleware**<`T`\>: (`next`: [`MiddlewareNextFunction`](modules.md#middlewarenextfunction)<`T`\>) => (`updatedAtoms`: [`AtomWithValueArray`](modules.md#atomwithvaluearray)<`T`\>) => `void` \| `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

#### Type declaration

▸ (`next`): (`updatedAtoms`: [`AtomWithValueArray`](modules.md#atomwithvaluearray)<`T`\>) => `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `next` | [`MiddlewareNextFunction`](modules.md#middlewarenextfunction)<`T`\> |

##### Returns

`fn`

▸ (`updatedAtoms`): `void` \| `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `updatedAtoms` | [`AtomWithValueArray`](modules.md#atomwithvaluearray)<`T`\> |

##### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[types.ts:60](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L60)

___

### MiddlewareNextFunction

Ƭ **MiddlewareNextFunction**<`T`\>: (`newUpdatedAtoms`: [`AtomWithValueArray`](modules.md#atomwithvaluearray)<`T`\>) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] = `any`[] |

#### Type declaration

▸ (`newUpdatedAtoms`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `newUpdatedAtoms` | [`AtomWithValueArray`](modules.md#atomwithvaluearray)<`T`\> |

##### Returns

`void`

#### Defined in

[types.ts:56](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L56)

___

### SynergyTuple

Ƭ **SynergyTuple**<`T`\>: { [I in keyof T]: Synergy<T[I][]\> } & { `length`: `T`[``"length"``]  } & `any`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [...any[][]] |

#### Defined in

[types.ts:14](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/types.ts#L14)

## Variables

### MiddlewareProvider

• `Const` **MiddlewareProvider**: `NamedExoticComponent`<[`MiddlewareProviderProps`](interfaces/MiddlewareProviderProps.md)\>

#### Defined in

[middleware-provider.tsx:10](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/middleware-provider.tsx#L10)

___

### SynergyProvider

• `Const` **SynergyProvider**: `NamedExoticComponent`<[`ProviderProps`](interfaces/ProviderProps.md)\>

#### Defined in

[provider.tsx:11](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/provider.tsx#L11)

## Functions

### createAtom

▸ **createAtom**<`T`\>(`defaultValue`, `name?`): [`Atom`](classes/Atom.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `defaultValue` | `T` |
| `name?` | `string` |

#### Returns

[`Atom`](classes/Atom.md)<`T`\>

#### Defined in

[helpers.ts:8](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/helpers.ts#L8)

___

### createSynergy

▸ **createSynergy**<`T`\>(...`atoms`): [`Synergy`](classes/Synergy.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...atoms` | [`SynergyTuple`](modules.md#synergytuple)<`T`\> |

#### Returns

[`Synergy`](classes/Synergy.md)<`T`\>

#### Defined in

[helpers.ts:10](https://github.com/lukasbach/synergies/blob/b504010/packages/synergies/src/helpers.ts#L10)
