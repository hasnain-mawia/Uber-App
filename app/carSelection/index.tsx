import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Modal, Pressable, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import styles from '@/styles/location';
import { useLocalSearchParams } from 'expo-router';
import Transport from '@/constants';
import * as Icon from "react-native-feather";


export default function HomeScreen() {
    const [fare, setfare] = useState<any>()
    const params = useLocalSearchParams();
    const { pickupName, pickupAddress, pickupLatitude, pickupLongitude, dropOffName, dropOffAddress, dropOffLatitude, dropOffLongitude } = params
    const [activeproducts, setactiveProducts] = useState<any>(null)

    const selectedTransport = (value: any) => {
        setactiveProducts(value.id)
        const baseFare = value.rupees
        const distance = calCrow(pickupLatitude, pickupLongitude, dropOffLatitude, dropOffLongitude);
        const fare = baseFare * distance;
        setfare(Math.round(fare))
        console.log(fare)
    }

    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value:any) 
    {
        return Value * Math.PI / 180;
    }


    return (
        <View style={styles.container}>

            <View className='flex-row gap-2 w-[100%] px-2 my-2'>
                {params &&
                    <View className='bg-[#abd9fa] rounded-2xl p-3 flex-1'>
                        <Text className='text-[15px] font-bold text-[#ff2929]'>Pickup Location</Text>
                        <Text> {pickupName}</Text>
                        <Text> {pickupAddress}</Text>
                    </View>
                }
                {params &&
                    <View className='bg-[#abd9fa] rounded-2xl p-3 flex-1'>
                        <Text className='text-[15px] font-bold text-[#ff2929]'>DropOff Location</Text>
                        <Text> {dropOffName}</Text>
                        <Text> {dropOffAddress}</Text>
                    </View>
                }
            </View>
            <ScrollView horizontal={false}>
                <View className='flex flex-col m-4 space-y-2'>
                    {Transport.map((item: any, index: number) => {
                        let isActive = item.id == activeproducts;
                        let btnClass = isActive ? 'bg-gray-500' : 'bg-[#209df7]';
                        return (
                            <TouchableOpacity key={index} onPress={() => selectedTransport(item)}>
                                <View className={`${btnClass} flex flex-row justify-between items-center p-3 rounded-2xl`}>
                                    <View className='flex flex-col'>
                                        <Text className='text-[#080808] text-[12px] bg-white px-1 rounded-full'>{item.person} Person Space</Text>
                                        <Text className='text-white text-[20px]'>{item.name}</Text>
                                    </View>
                                    <View className='text-white bg-black p-3 rounded-full flex flex-col items-center justify-center'>
                                        <Text className='text-[15px] text-white'>Rs:{item.rupees}</Text>
                                        <Text className='text-white text-[10px]'>Per/KM</Text>
                                    </View>
                                    <Image className='w-[50px] h-[50px]' source={item.image}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
            <View className='flex flex-row gap-2 m-3'>
                <View className='bg-gray-500 p-3 text-[18px] rounded-full flex-0.5'>
                    <Text className='text-[15px] text-white'>Total Amount : {fare ? fare : 0}</Text>
                </View>
                {!activeproducts ?
                    <TouchableOpacity disabled={true} className='bg-[#cfcfcf] p-3 text-[18px] rounded-full flex-1'>
                        <Text className='text-white text-center text-[16px]'>Ready To Go</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity className='bg-[#209df7] p-3 text-[18px] rounded-full flex-1'>
                        <Text className='text-white text-center text-[16px]'>Ready To Go </Text>
                    </TouchableOpacity>
                }
            </View>

        </View>
    );
}

