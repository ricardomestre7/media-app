import { CreateUserData, GetAudioClipsData, AddCommentData, AddCommentVariables, LikeAudioClipData, LikeAudioClipVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useGetAudioClips(options?: useDataConnectQueryOptions<GetAudioClipsData>): UseDataConnectQueryResult<GetAudioClipsData, undefined>;
export function useGetAudioClips(dc: DataConnect, options?: useDataConnectQueryOptions<GetAudioClipsData>): UseDataConnectQueryResult<GetAudioClipsData, undefined>;

export function useAddComment(options?: useDataConnectMutationOptions<AddCommentData, FirebaseError, AddCommentVariables>): UseDataConnectMutationResult<AddCommentData, AddCommentVariables>;
export function useAddComment(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentData, FirebaseError, AddCommentVariables>): UseDataConnectMutationResult<AddCommentData, AddCommentVariables>;

export function useLikeAudioClip(options?: useDataConnectMutationOptions<LikeAudioClipData, FirebaseError, LikeAudioClipVariables>): UseDataConnectMutationResult<LikeAudioClipData, LikeAudioClipVariables>;
export function useLikeAudioClip(dc: DataConnect, options?: useDataConnectMutationOptions<LikeAudioClipData, FirebaseError, LikeAudioClipVariables>): UseDataConnectMutationResult<LikeAudioClipData, LikeAudioClipVariables>;
