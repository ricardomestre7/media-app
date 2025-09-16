const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'midia-app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const getAudioClipsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAudioClips');
}
getAudioClipsRef.operationName = 'GetAudioClips';
exports.getAudioClipsRef = getAudioClipsRef;

exports.getAudioClips = function getAudioClips(dc) {
  return executeQuery(getAudioClipsRef(dc));
};

const addCommentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddComment', inputVars);
}
addCommentRef.operationName = 'AddComment';
exports.addCommentRef = addCommentRef;

exports.addComment = function addComment(dcOrVars, vars) {
  return executeMutation(addCommentRef(dcOrVars, vars));
};

const likeAudioClipRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LikeAudioClip', inputVars);
}
likeAudioClipRef.operationName = 'LikeAudioClip';
exports.likeAudioClipRef = likeAudioClipRef;

exports.likeAudioClip = function likeAudioClip(dcOrVars, vars) {
  return executeMutation(likeAudioClipRef(dcOrVars, vars));
};
