import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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

        await SignIn(email, password);

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
        console.log(error);
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
        console.log(error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {

    try {
        const currentAccount = await account.get(
            email,
            password,
        );

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(config.databaseId,
            config.postCollectionId,
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}