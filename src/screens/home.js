import React, { useState, useEffect, Component } from 'react'
import { View, Text, ScrollView, SafeAreaContent, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, TouchableHighlightBase } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableHighlight } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window");

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            rowTranslateAnimatedValues: [],
            disableInputs: false
        }
    }

    async componentDidMount() {
        await this.read();
    }

    findIndex = (arr, key) => {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key === key) {
                return i;
            }
        }
        return -1;
    }

    read = async () => {
        try {
            const notesValueRaw = await AsyncStorage.getItem("notes");
            const notesValue = JSON.parse(notesValueRaw) ?? [];
            var rowTranslateAnimatedValues = [notesValue.length];
            for (var i = 0; i < notesValue.length; i++) {
                notesValue[i].key = `${i}`;
            }
            Array(notesValue.length)
                .fill('')
                .forEach((_, i) => {
                    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
                });
            this.setState({
                notes: notesValue,
                rowTranslateAnimatedValues: rowTranslateAnimatedValues
            })
        } catch (e) {
            console.error(e)
        }
    }

    renderHiddenItem = () => (
        <View style={styles.rowBack}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}>SİL</Text>
            </View>
        </View>
    );

    renderItem = data => (
        <Animated.View
            style={[
                styles.rowFrontContainer,
                {
                    height: this.state.rowTranslateAnimatedValues[data.item.key]
                        .interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 70],
                        }),
                },
            ]}
        >
            <TouchableOpacity style={styles.rowFront}
                underlayColor={'#AAA'}
                onPress={() => {
                    this.setState({
                        disableInputs: true
                    })
                    Actions.note({ values: { name: data.item.name, note: data.item.note } })
                    this.setState({
                        disableInputs: false
                    })
                }}
                activeOpacity={1}
                disabled={this.state.disableInputs}
            >
                <View>
                    {data.item.note.length > 50 ?

                        <Text>
                            {data.item.note.slice(0, 50)}...
                    </Text>
                        : <Text>
                            {data.item.note}
                        </Text>
                    }
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
    onSwipeValueChange = swipeData => {
        try {
            const { key, value } = swipeData;
            if (
                value < -Dimensions.get('window').width &&
                !this.animationIsRunning
            ) {
                this.animationIsRunning = true;
                Animated.timing(this.state.rowTranslateAnimatedValues[key], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start(() => {
                    var notesValue = [...this.state.notes];
                    var index = this.findIndex(notesValue, key);
                    if (index > -1) {
                        notesValue.splice(index, 1);
                        AsyncStorage.setItem(
                            "notes",
                            JSON.stringify(notesValue)
                        ).then(() => {
                            this.setState({
                                notes: notesValue,
                            });
                        });
                    }
                    this.animationIsRunning = false;
                });
            }
        } catch (e) {
            console.error(e)
        }
    };
    render() {
        return (
            <View style={styles.container}>
                {(this.state.notes == null || this.state.notes.length == 0) ?
                    <View style={{ flex: 9, justifyContent: 'center' }}>
                        <Text style={styles.addNoteText}>Yeni bir not eklemek için +'ya dokun</Text>
                    </View> :
                    <View>
                        <SwipeListView
                            data={this.state.notes}
                            renderItem={this.renderItem}
                            renderHiddenItem={this.renderHiddenItem}
                            rightOpenValue={-Dimensions.get('window').width}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={1000}
                            onSwipeValueChange={this.onSwipeValueChange}
                            useNativeDriver={false}
                            disableRightSwipe
                        />
                    </View>
                }
                <View style={{ alignItems: 'flex-end', flexDirection: 'column-reverse', flex: 1, position: 'absolute', marginTop: height - (height / 5), marginLeft: width - (width / 4) }}>
                    <TouchableOpacity style={styles.addButton}
                        onPress={() => {
                            this.setState({
                                disableInputs: true
                            })
                            Actions.note({ values: { name: '' } })
                            this.setState({
                                disableInputs: false
                            })
                        }}
                        disabled={this.state.disableInputs}
                    >
                        <Image source={require("../../assets/add.png")} style={{ width: 70, height: 70 }} ></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        marginTop: 5
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFrontContainer: {
    },
    rowFront: {
        backgroundColor: '#e3e8fc',
        height: 65,
        marginTop: 5,
        paddingLeft: 15,
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',
        borderRadius: 10
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginLeft: 5,
        marginTop: 5,
        marginRight: 5,
        borderRadius: 10,
        borderColor: '#f2edf2',
        borderWidth: 0.5
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    addNoteText: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',

    },
    addButton: {
        alignItems: 'flex-end',
        marginRight: '7%',
        marginTop: '20%',
        marginBottom: '7%'
    }

})

