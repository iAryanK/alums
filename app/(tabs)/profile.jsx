import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import PostCard from '../../components/PostCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'
import CustomModal from '../../components/CustomModal'

const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleLogOut = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/sign-in");
    };


    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
                        <TouchableOpacity
                            onPress={() => setIsModalOpen(true)}
                            className="flex w-full items-end mb-10"
                        >
                            <Image
                                source={icons.logout}
                                resizeMode="contain"
                                className="w-6 h-6"
                            />
                        </TouchableOpacity>

                        <View className="w-16 h-16 rounded-lg flex justify-center items-center">
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <InfoBox
                            title={user?.username}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />

                        <View className="mt-5 flex flex-row">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                titleStyles="text-xl"
                                containerStyles="mr-10"
                            />
                            <InfoBox
                                title="1.2k"
                                subtitle="Followers"
                                titleStyles="text-xl"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No posts found"
                        subtitle="No videos found for this search query."
                    />
                )}
            />
            {isModalOpen && (
                <CustomModal
                    isOpen={isModalOpen}
                    modalImage={images.question}
                    modalMessage="Are you sure you want to log out?"
                    setIsModalOpen={setIsModalOpen}
                    onPressOK={handleLogOut}
                />
            )}
        </SafeAreaView>
    )
}

export default Profile