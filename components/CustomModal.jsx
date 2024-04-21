import { Image, Modal, Text, View } from "react-native"
import CustomButton from "./CustomButton"


const CustomModal = ({ isOpen, modalImage, modalMessage, setIsModalOpen, onPressOK }) => {

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            statusBarTranslucent
            transparent
        >
            <View className="items-center justify-center flex-auto px-3 bg-transparent">
                <View className='w-full h-fit p-5 rounded-xl bg-black-100 flex items-center justify-center'>
                    <View className='rounded-full bg-black-100 border-[4px] border-gray-400 -top-16'>
                        <Image
                            source={modalImage}
                            className='h-20 w-20 rounded-full'
                            resizeMode="cover"
                        />
                    </View>
                    <Text className='font-pmedium text-lg text-white -top-5'>{modalMessage}</Text>
                    <View className='flex flex-row w-1/2 items-center justify-center'>
                        <CustomButton
                            title="Log Out"
                            handlePress={() => {
                                setIsModalOpen(false);
                                onPressOK();
                            }}
                            containerStyles='w-full mr-2'
                            textStyles='text-white'
                        />
                        <CustomButton
                            title="Cancel"
                            handlePress={() => setIsModalOpen(false)} containerStyles='w-full'
                            textStyles='text-white'
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal