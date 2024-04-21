import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.aryan.alums',
    projectId: '66209f27910494d4855c',
    databaseId: '6620a0b2677e14bcc2dc',
    userCollectionId: '6620a0d78a5bdebc6dab',
    postCollectionId: '6620a1046c65d8da7b02',
    storageId: '6620a2fd5222f831b010'
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {

    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await SignInUser(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            })

        return newUser;
    } catch (error) {
        console.log("CREATE_USER_ERROR", error);
        throw new Error(error);
    }
}

export const SignInUser = async (email, password) => {

    try {
        const session = await account.createEmailSession(
            email,
            password,
        );

        return session;
    } catch (error) {
        console.log("SIGNIN_USER_ERROR", error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {

    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log("GET_CURRENT_USER_ERROR", error);
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(config.databaseId,
            config.postCollectionId,
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(config.databaseId,
            config.postCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(config.databaseId,
            config.postCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(config.databaseId,
            config.postCollectionId,
            [Query.equal('users', userId)],
            [Query.orderDesc('$createdAt')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl)
            throw Error;

        return fileUrl;

    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return;

    if (file.fileName === null)
        file.fileName = file.uri.substring(file.uri.lastIndexOf('/') + 1, file.uri.length);

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.filesize,
        uri: file.uri,
    }

    console.log('[FILE]', file);

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        console.log("[UPLOADED]", uploadedFile);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createPost = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            config.databaseId,
            config.postCollectionId,
            ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            post: videoUrl,
            prompt: form.prompt,
            users: form.userId
        })

        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}