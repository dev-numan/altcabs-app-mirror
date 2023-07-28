import React, {useState} from 'react';
import {Image, Text, View, StyleSheet, Pressable} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Icon, Divider, Avatar, HStack, Center, VStack} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {USER_STATUS_LOG_OUT} from '../store/slices/auth.slice';
import {useEffect} from 'react';

export default function CustomerAppDrawer(props) {
  const dispatch = useDispatch();
  const User = useSelector(state => state.Auth.TOKEN);
  const role = useSelector(state => state.Auth.role);

  console.log('role', role);
  console.log('User', User);

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
          icon: 'home',
          type: Ionicons,
          screen: 'MyBookings',
          visible: false,
          child: [
            {
              name: 'New Requests',
              icon: 'home',
              type: Ionicons,
              screen: 'NewRequest',
            },
            {
              name: 'Urgent',
              icon: 'home',
              type: Ionicons,
              screen: 'Urgent',
            },
            {
              name: 'Upcoming',
              icon: 'home',
              type: Ionicons,
              screen: 'Upcoming',
            },
            {
              name: 'Completed',
              icon: 'home',
              type: Ionicons,
              screen: 'Completed',
            },
            {
              name: 'Action Required',
              icon: 'home',
              type: Ionicons,
              screen: 'ActionRequired',
            },
            {
              name: 'Driver no marked',
              icon: 'home',
              type: Ionicons,
              screen: 'DriverNoMarked',
            },
            {
              name: 'Customer no marked',
              icon: 'home',
              type: Ionicons,
              screen: 'CustomerNoMarked',
            },
            {
              name: 'Cancelled',
              icon: 'home',
              type: Ionicons,
              screen: 'Cancelled',
            },
          ],
        },

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
          name: 'Homes',
          icon: 'home',
          type: Ionicons,
          screen: 'TabOneScreen',
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
  }, []);

  return (
    <DrawerContentScrollView
      contentContainerStyle={{flex: 1}}
      {...props}
      showsVerticalScrollIndicator={false}>
      <View style={styles.drawerContent}>
        <View>
          <VStack space={3} alignItems="center" style={{margin: 10}}>
            <Center size={16} shadow={3}>
              <Avatar
                size="xl"
                style={{alignSelf: 'center', backgroundColor: '#38bdf8'}}
                source={require(`../assets/images/icon.png`)}>
                FA
              </Avatar>
            </Center>
            <Center space={1}>
              <Text style={styles.title}>
                {User?.name[0].toUpperCase() + User?.name.substr(1)}
              </Text>
            </Center>
            <Center space={1}>
              <Text style={styles.caption}>
                @ {User?.role[0].toUpperCase() + User?.role.substr(1)}
              </Text>
            </Center>
          </VStack>
        </View>
        <Divider />
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
                        backgroundColor: pressed ? '#e0f2fe' : 'white',
                      },
                      {
                        borderBottomStartRadius: 25,
                        borderTopEndRadius: 25,
                        marginHorizontal: 7,
                        padding: 2,
                      },
                    ]}>
                    <HStack space={3} alignItems="center" style={{margin: 10}}>
                      <Center>
                        <Icon
                          name={item.icon}
                          color="#1C2B39"
                          as={item.type}
                          size="sm"
                        />
                      </Center>
                      <Center>
                        <Text style={[styles.text]}>{item?.name}</Text>
                      </Center>
                    </HStack>
                  </Pressable>

                  {item.visible && (
                    <View>
                      {item.child.map((item1 ,j)=> {
                        return (
                          <Pressable
                          key={j}
                            onPress={() => {
                              if (item1?.name === 'Sign Out') {

                                props.navigation.closeDrawer();
                                dispatch(USER_STATUS_LOG_OUT());
                              } else props.navigation.navigate(item1.screen);
                            }}
                          
                            style={({pressed}) => [
                              {
                                backgroundColor: pressed ? '#e0f2fe' : 'white',
                              },
                              {
                                borderBottomStartRadius: 25,
                                borderTopEndRadius: 25,
                                marginHorizontal: 7,
                                padding: 2,
                              },
                            ]}>
                            <HStack
                              space={3}
                              alignItems="center"
                              style={{margin: 10}}>
                              <Center>
                                <Icon
                                  name={item1.icon}
                                  color="#1C2B39"
                                  as={item1.type}
                                  size="sm"
                                />
                              </Center>
                              <Center>
                                <Text style={[styles.text]}>{item1?.name}</Text>
                              </Center>
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
                    } else props.navigation.navigate(item.screen);
                  }}
                  key={i}
                  style={({pressed}) => [
                    {
                      backgroundColor: pressed ? '#e0f2fe' : 'white',
                    },
                    {
                      borderBottomStartRadius: 25,
                      borderTopEndRadius: 25,
                      marginHorizontal: 7,
                      padding: 2,
                    },
                  ]}>
                  <HStack space={3} alignItems="center" style={{margin: 10}}>
                    <Center>
                      <Icon
                        name={item.icon}
                        color="#1C2B39"
                        as={item.type}
                        size="sm"
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

        <Center flex={1} justifyContent="flex-end">
          <Image
            source={require('../assets/images/altcabsNewLongLogo2.png')}
            style={{
              height: 20,
              marginBottom: 21,
              resizeMode: 'contain',
            }}
          />
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
    marginTop: 12,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 7,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 12,
    color: '#a1a1aa',
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
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
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
    color: '#1C2B39',
  },
});
