import React, {useState} from 'react';
import {Image, Text, View, StyleSheet, Pressable} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Icon, Divider, Avatar, HStack, Center, VStack} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {USER_STATUS_LOG_OUT} from '../store/slices/auth.slice';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from '../api';
import colors from '../constants/colors';

export default function CustomerAppDrawer(props) {
  const dispatch = useDispatch();
  const User = useSelector(state => state.Auth.TOKEN);
  const role = useSelector(state => state.Auth.role);
  const TRIPSDATA = useSelector(state => state.Auth.TRIPS);

  const logout = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmtoken');

    console.log('Logout info', fcmToken);

    let response = await API.post('/mobileApp/auth/logout', {
      token: fcmToken,
      user: User,
    });
  };

  console.log('Trip data', TRIPSDATA);
  // console.log('User', User);

  const [list, setList] = useState([]);

  useEffect(() => {
    if (User.role == 'admin') {
      let listss = [
        {
          name: 'DashBoard',
          icon: 'home',
          type: Ionicons,
          screen: 'AdminHome',
        },
        {
          name: 'My Bookings',
          icon: 'calendar',
          type: Ionicons,
          screen: 'MyBookings',
          visible: false,
          child: [
            {
              name: 'New Requests',
              // icon: 'home',
              // type: Ionicons,
              screen: 'NewRequest',
              value: TRIPSDATA?.new_requests?.length || 0,
              count: true,
            },
            {
              name: 'Urgent',
              // icon: 'home',
              // type: Ionicons,
              screen: 'Urgent',
              value: TRIPSDATA?.urgent?.length || 0,
              count: true,
            },
            {
              name: 'Upcoming',
              // icon: 'home',
              // type: Ionicons,
              screen: 'Upcoming',
              value: TRIPSDATA?.upcoming?.length || 0,
              count: true,
            },
            {
              name: 'Completed',
              // icon: 'home',
              // type: Ionicons,
              screen: 'Completed',
              value: TRIPSDATA?.completed?.length || 0,
              count: true,
            },
            {
              name: 'Action Required',
              // icon: 'home',
              // type: Ionicons,
              screen: 'ActionRequired',
              value: TRIPSDATA?.action_required?.length || 0,
              count: true,
            },
            {
              name: 'Driver no marked',
              // icon: 'home',
              // type: Ionicons,
              screen: 'DriverNoMarked',
              value: TRIPSDATA?.driver_no_show?.length || 0,
              count: true,
            },
            {
              name: 'Customer no marked',
              // icon: 'home',
              // type: Ionicons,
              screen: 'CustomerNoMarked',
              value: TRIPSDATA?.customer_no_show?.length || 0,
              count: true,
            },
            {
              name: 'Cancelled',
              // icon: 'home',
              // type: Ionicons,
              screen: 'Cancelled',
              value: TRIPSDATA?.canceled?.length || 0,
              count: true,
            },
          ],
        },
        // {
        //   name: 'Availability',
        //   icon: 'time',
        //   type: Ionicons,
        //   screen: 'Availability',
        //   visible: false,
        //   child: [
        //     {
        //       name: 'Take A Break',
        //       // icon: 'home',
        //       // type: Ionicons,
        //       screen: 'Break',
        //     },
        //   ],
        // },
        {
          name: 'Sign Out',
          icon: 'logout',
          type: AntDesign,
          screen: '',
        },
      ];

      setList(listss);
    } else {
      let listmm = [
        {
          name: 'Home',
          icon: 'home',
          type: Ionicons,
          screen: 'Customer Landing',
        },
        {
          name: 'My Bookings',
          icon: 'calendar-check',
          type: Ionicons,
          screen: 'MyBookings',
        },
        {
          name: 'Completed Bookings',
          icon: 'checkmark-done',
          type: Ionicons,
          screen: 'Bookings History',
        },
        {
          name: 'Sign Out',
          icon: 'logout',
          type: AntDesign,
          screen: '',
        },
      ];

      setList(listmm);
    }
  }, [TRIPSDATA?.all?.length]);

  return (
    <DrawerContentScrollView
      contentContainerStyle={{flex: 1, backgroundColor: colors.PRIMARY}}
      {...props}
      style={{backgroundColor: colors.PRIMARY}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.drawerContent}>
        <View style={styles.headerSection}>
          <VStack space={3} alignItems="center" style={{margin: 20, marginTop: 30}}>
            <Center size={20} shadow={3}>
              <Avatar
                size="xl"
                style={{
                  alignSelf: 'center',
                  backgroundColor: colors.YELLOW,
                  borderWidth: 3,
                  borderColor: '#2a3442',
                }}
                source={require(`../assets/images/icon.png`)}>
                <Text style={{color: colors.PRIMARY, fontSize: 32, fontWeight: 'bold'}}>
                  {User?.name[0].toUpperCase()}
                </Text>
              </Avatar>
            </Center>
            <Center space={1}>
              <Text style={styles.title}>
                {User?.name[0].toUpperCase() + User?.name.substr(1)}
              </Text>
            </Center>
            <Center space={1}>
              <Text style={styles.caption}>
                {User?.role[0].toUpperCase() + User?.role.substr(1)}
              </Text>
            </Center>
          </VStack>
        </View>
        <Divider bg="#2a3442" />
        <VStack style={styles.drawerSection} {...props}>
          {list.map((item, i) => {
            if (item.child) {
              return (
                <View>
                  <Pressable
                    onPress={() => {
                      setList(pre => {
                        let temp = pre.map(val => {
                          if (val.screen == item.screen) {
                            return {
                              ...item,
                              visible: !item.visible,
                            };
                          } else {
                            return val;
                          }
                        });

                        return temp;
                      });
                    }}
                    key={i}
                    style={({pressed}) => [
                      {
                        backgroundColor: pressed ? '#2a3442' : 'transparent',
                      },
                      {
                        borderRadius: 12,
                        marginHorizontal: 10,
                        marginVertical: 4,
                        padding: 2,
                      },
                    ]}>
                    <HStack space={3} alignItems="center" style={{margin: 10}}>
                      <Center>
                        <Icon
                          name={item.icon}
                          color={colors.YELLOW}
                          as={item.type}
                          size="md"
                        />
                      </Center>
                      <Center>
                        <Text style={[styles.text]}>{item?.name}</Text>
                      </Center>
                    </HStack>
                  </Pressable>

                  {item.visible && (
                    <View>
                      {item.child.map((item1, j) => {
                        return (
                          <Pressable
                            key={j}
                            onPress={() => {
                              if (item1?.name === 'Sign Out') {
                                props.navigation.closeDrawer();
                                dispatch(USER_STATUS_LOG_OUT());
                                logout();
                              } else props.navigation.navigate(item1.screen);
                            }}
                            style={({pressed}) => [
                              {
                                backgroundColor: pressed ? '#2a3442' : 'transparent',
                              },
                              {
                                borderRadius: 12,
                                marginHorizontal: 10,
                                marginVertical: 2,
                                padding: 2,
                              },
                            ]}>
                            <HStack
                              space={3}
                              alignItems="center"
                              style={{margin: 10, marginLeft: 30}}>
                              <Center>
                                <Icon
                                  name={item1.icon}
                                  color={colors.YELLOW}
                                  as={item1.type}
                                  size="sm"
                                />
                              </Center>
                              <Center>
                                <Text style={[styles.text]}>{item1?.name}</Text>
                              </Center>
                              {item1?.count && (
                                <View
                                  style={{
                                    display: 'flex',
                                    margin: 0,
                                    padding: 0,
                                    backgroundColor: colors.PRIMARY,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    alignItems: 'center', // horizontally center
                                    justifyContent: 'center', // vertically center
                                  }}>
                                  <Text
                                    style={{
                                      color: 'white',
                                      fontSize: 14,
                                      fontWeight: 'bold',
                                    }}>
                                    {item1?.value}
                                  </Text>
                                </View>
                              )}
                            </HStack>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            } else {
              return (
                <Pressable
                  onPress={() => {
                    if (item?.name === 'Sign Out') {
                      props.navigation.closeDrawer();
                      dispatch(USER_STATUS_LOG_OUT());
                      logout();
                    } else props.navigation.navigate(item.screen);
                  }}
                  key={i}
                  style={({pressed}) => [
                    {
                      backgroundColor: pressed ? '#2a3442' : 'transparent',
                    },
                    {
                      borderRadius: 12,
                      marginHorizontal: 10,
                      marginVertical: 4,
                      padding: 2,
                    },
                  ]}>
                  <HStack space={3} alignItems="center" style={{margin: 10}}>
                    <Center>
                      <Icon
                        name={item.icon}
                        color={colors.YELLOW}
                        as={item.type}
                        size="md"
                      />
                    </Center>
                    <Center>
                      <Text style={[styles.text]}>{item?.name}</Text>
                    </Center>
                  </HStack>
                </Pressable>
              );
            }
          })}
          <Divider my={4} />
        </VStack>

        <Center flex={1} justifyContent="flex-end" style={{paddingBottom: 20}}>
          <View style={{
            backgroundColor: '#1a2332',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#2a3442',
          }}>
            <Image
              source={require('../assets/images/altcabsNewLongLogo2.png')}
              style={{
                height: 20,
                resizeMode: 'contain',
              }}
            />
          </View>
        </Center>
        {/* <Pressable
              onPress={() => setShift(!shift)}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#e0f2fe' : 'white',
                },
                {
                  borderBottomEndRadius: 25,
                  borderTopEndRadius: 25,
                  marginRight: 7,
                },
              ]}>
              <HStack alignItems="center" m={1}>
                <Center>
                  <IconButton
                    variant="solid"
                    style={{borderRadius: 80}}
                    bg={shift ? 'green.500' : 'red.500'}
                    _pressed={{bg: shift ? 'green.600' : 'red.600'}}
                    icon={
                      <Icon
                        size="sm"
                        ml={0.1}
                        as={Ionicons}
                        name="md-power"
                        color="white"
                      />
                    }
                  />
                </Center>
                <Center flexGrow={1}>
                  <Heading
                    color={shift ? 'green.500' : 'red.500'}
                    fontSize="lg">
                    {shift ? 'End' : 'Start'} The Shift
                  </Heading>
                </Center>
              </HStack>
            </Pressable> */}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  headerSection: {
    backgroundColor: '#1a2332',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3442',
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 22,
    marginTop: 7,
    fontWeight: 'bold',
    color: colors.YELLOW,
  },
  caption: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 10,
    backgroundColor: colors.PRIMARY,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#2a3442',
    borderTopWidth: 1,
    marginRight: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#e0e0e0',
  },
  text: {
    flexGrow: 1,
    textAlign: 'left',
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  count: {
    flexGrow: 1,
    textAlign: 'left',
    fontSize: 16,
    color: 'white',
  },
});
