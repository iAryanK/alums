import { Alert, Image, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, useRouter } from 'expo-router'
import { SignInUser, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNotValid, setIsNotValid] = useState(false);
    const router = useRouter();

    const submit = async () => {
        setIsNotValid(false);
        if (!form.email || !form.password)
            Alert.alert("Error", 'Please fill in all the fields');

        setIsSubmitting(true);

        try {
            await SignInUser(form.email, form.password);

            const result = await getCurrentUser();

            setUser(result);
            setIsLoggedIn(true);

            router.replace('/home');
        } catch (error) {
            setIsNotValid(true);
            console.log("SIGNIN_ERROR", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center px-4 my-6 min-h-[90vh]">
                    <Image
                        source={images.logo}
                        resizeMode='contain'
                        className="w-[115px] h-[35px]"
                    />

                    <Text className="text-2xl text-white text-semibold mt-10 font-semibold">
                        Welcome! Sign In
                    </Text>

                    {isNotValid && (
                        <Text className="text-base text-red-500 text-semibold mt-7 font-semibold">
                            ⚠️ The email or password entered is incorrect !
                        </Text>
                    )}

                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles='w-full mt-7'
                        isLoading={isSubmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className='text-lg text-gray-100 font-pregular'>Don't have an account?</Text>
                        <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn