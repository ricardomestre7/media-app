# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetAudioClips*](#getaudioclips)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*AddComment*](#addcomment)
  - [*LikeAudioClip*](#likeaudioclip)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetAudioClips
You can execute the `GetAudioClips` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAudioClips(): QueryPromise<GetAudioClipsData, undefined>;

interface GetAudioClipsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAudioClipsData, undefined>;
}
export const getAudioClipsRef: GetAudioClipsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAudioClips(dc: DataConnect): QueryPromise<GetAudioClipsData, undefined>;

interface GetAudioClipsRef {
  ...
  (dc: DataConnect): QueryRef<GetAudioClipsData, undefined>;
}
export const getAudioClipsRef: GetAudioClipsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAudioClipsRef:
```typescript
const name = getAudioClipsRef.operationName;
console.log(name);
```

### Variables
The `GetAudioClips` query has no variables.
### Return Type
Recall that executing the `GetAudioClips` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAudioClipsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAudioClipsData {
  audioClips: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    audioFileUrl: string;
    durationSeconds?: number | null;
    createdAt: TimestampString;
    user?: {
      id: UUIDString;
      username: string;
    } & User_Key;
  } & AudioClip_Key)[];
}
```
### Using `GetAudioClips`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAudioClips } from '@dataconnect/generated';


// Call the `getAudioClips()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAudioClips();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAudioClips(dataConnect);

console.log(data.audioClips);

// Or, you can use the `Promise` API.
getAudioClips().then((response) => {
  const data = response.data;
  console.log(data.audioClips);
});
```

### Using `GetAudioClips`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAudioClipsRef } from '@dataconnect/generated';


// Call the `getAudioClipsRef()` function to get a reference to the query.
const ref = getAudioClipsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAudioClipsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.audioClips);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.audioClips);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## AddComment
You can execute the `AddComment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addComment(vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface AddCommentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
}
export const addCommentRef: AddCommentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addComment(dc: DataConnect, vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface AddCommentRef {
  ...
  (dc: DataConnect, vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
}
export const addCommentRef: AddCommentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentRef:
```typescript
const name = addCommentRef.operationName;
console.log(name);
```

### Variables
The `AddComment` mutation requires an argument of type `AddCommentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentVariables {
  audioClipId: UUIDString;
  text: string;
}
```
### Return Type
Recall that executing the `AddComment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentData {
  comment_insert: Comment_Key;
}
```
### Using `AddComment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addComment, AddCommentVariables } from '@dataconnect/generated';

// The `AddComment` mutation requires an argument of type `AddCommentVariables`:
const addCommentVars: AddCommentVariables = {
  audioClipId: ..., 
  text: ..., 
};

// Call the `addComment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addComment(addCommentVars);
// Variables can be defined inline as well.
const { data } = await addComment({ audioClipId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addComment(dataConnect, addCommentVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
addComment(addCommentVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `AddComment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentRef, AddCommentVariables } from '@dataconnect/generated';

// The `AddComment` mutation requires an argument of type `AddCommentVariables`:
const addCommentVars: AddCommentVariables = {
  audioClipId: ..., 
  text: ..., 
};

// Call the `addCommentRef()` function to get a reference to the mutation.
const ref = addCommentRef(addCommentVars);
// Variables can be defined inline as well.
const ref = addCommentRef({ audioClipId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentRef(dataConnect, addCommentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

## LikeAudioClip
You can execute the `LikeAudioClip` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
likeAudioClip(vars: LikeAudioClipVariables): MutationPromise<LikeAudioClipData, LikeAudioClipVariables>;

interface LikeAudioClipRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikeAudioClipVariables): MutationRef<LikeAudioClipData, LikeAudioClipVariables>;
}
export const likeAudioClipRef: LikeAudioClipRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
likeAudioClip(dc: DataConnect, vars: LikeAudioClipVariables): MutationPromise<LikeAudioClipData, LikeAudioClipVariables>;

interface LikeAudioClipRef {
  ...
  (dc: DataConnect, vars: LikeAudioClipVariables): MutationRef<LikeAudioClipData, LikeAudioClipVariables>;
}
export const likeAudioClipRef: LikeAudioClipRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the likeAudioClipRef:
```typescript
const name = likeAudioClipRef.operationName;
console.log(name);
```

### Variables
The `LikeAudioClip` mutation requires an argument of type `LikeAudioClipVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LikeAudioClipVariables {
  audioClipId: UUIDString;
}
```
### Return Type
Recall that executing the `LikeAudioClip` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LikeAudioClipData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LikeAudioClipData {
  like_insert: Like_Key;
}
```
### Using `LikeAudioClip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, likeAudioClip, LikeAudioClipVariables } from '@dataconnect/generated';

// The `LikeAudioClip` mutation requires an argument of type `LikeAudioClipVariables`:
const likeAudioClipVars: LikeAudioClipVariables = {
  audioClipId: ..., 
};

// Call the `likeAudioClip()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await likeAudioClip(likeAudioClipVars);
// Variables can be defined inline as well.
const { data } = await likeAudioClip({ audioClipId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await likeAudioClip(dataConnect, likeAudioClipVars);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
likeAudioClip(likeAudioClipVars).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

### Using `LikeAudioClip`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, likeAudioClipRef, LikeAudioClipVariables } from '@dataconnect/generated';

// The `LikeAudioClip` mutation requires an argument of type `LikeAudioClipVariables`:
const likeAudioClipVars: LikeAudioClipVariables = {
  audioClipId: ..., 
};

// Call the `likeAudioClipRef()` function to get a reference to the mutation.
const ref = likeAudioClipRef(likeAudioClipVars);
// Variables can be defined inline as well.
const ref = likeAudioClipRef({ audioClipId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = likeAudioClipRef(dataConnect, likeAudioClipVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.like_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.like_insert);
});
```

