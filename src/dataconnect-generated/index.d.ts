import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCommentData {
  comment_insert: Comment_Key;
}

export interface AddCommentVariables {
  audioClipId: UUIDString;
  text: string;
}

export interface AudioClip_Key {
  id: UUIDString;
  __typename?: 'AudioClip_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface Follow_Key {
  followerId: UUIDString;
  followedId: UUIDString;
  __typename?: 'Follow_Key';
}

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

export interface LikeAudioClipData {
  like_insert: Like_Key;
}

export interface LikeAudioClipVariables {
  audioClipId: UUIDString;
}

export interface Like_Key {
  userId: UUIDString;
  audioClipId: UUIDString;
  __typename?: 'Like_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface GetAudioClipsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAudioClipsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAudioClipsData, undefined>;
  operationName: string;
}
export const getAudioClipsRef: GetAudioClipsRef;

export function getAudioClips(): QueryPromise<GetAudioClipsData, undefined>;
export function getAudioClips(dc: DataConnect): QueryPromise<GetAudioClipsData, undefined>;

interface AddCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentVariables): MutationRef<AddCommentData, AddCommentVariables>;
  operationName: string;
}
export const addCommentRef: AddCommentRef;

export function addComment(vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;
export function addComment(dc: DataConnect, vars: AddCommentVariables): MutationPromise<AddCommentData, AddCommentVariables>;

interface LikeAudioClipRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LikeAudioClipVariables): MutationRef<LikeAudioClipData, LikeAudioClipVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LikeAudioClipVariables): MutationRef<LikeAudioClipData, LikeAudioClipVariables>;
  operationName: string;
}
export const likeAudioClipRef: LikeAudioClipRef;

export function likeAudioClip(vars: LikeAudioClipVariables): MutationPromise<LikeAudioClipData, LikeAudioClipVariables>;
export function likeAudioClip(dc: DataConnect, vars: LikeAudioClipVariables): MutationPromise<LikeAudioClipData, LikeAudioClipVariables>;

