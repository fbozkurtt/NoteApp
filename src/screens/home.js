import React, { useState, useEffect, Component } from 'react'
import { View, Text, ScrollView, SafeAreaContent, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableHighlight } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window");

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notes: []
        }
    }

    componentDidMount() {
        this.read();
    }
    read = async () => {
        try {
            const notesValueRaw = await AsyncStorage.getItem("notes");
            const notesValue = JSON.parse(notesValueRaw) ?? [];
            console.log(notesValue);
            for (var i = 0; i < notesValue.length; i++) {
                notesValue[i].key = `${i}`;
            }
            this.setState({
                notes: notesValue
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

    // deleteRow = async (rowMap, rowKey) => {
    //     this.closeRow(rowMap, rowKey);
    //     const notesValue = [...this.state.notes];
    //     var o = notesValue.map(w => w.key === rowKey)[0];
    //     var i = notesValue.indexOf(o);
    //     notesValue.splice(i, 1)
    //     try {
    //         await AsyncStorage.setItem(
    //             "notes",
    //             JSON.stringify(notesValue)
    //         );
    //     } catch (e) {
    //         console.error(e)
    //     }
    //     this.setState({ notes: notesValue });
    // };

    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    renderItem = data => (
        <TouchableHighlight style={styles.rowFront}
            underlayColor={'#AAA'}
            onPress={() => Actions.note({ values: { name: data.item.name, note: data.item.note } })}>
            <View>
                <Text>
                    {data.item.note.slice(0, 40)}
                </Text>
            </View>
        </TouchableHighlight>
    );
    onSwipeValueChange = async (swipeData) => {
        try {
            var rowTranslateAnimatedValues = {};
            Array(this.state.notes.length)
                .fill('')
                .forEach((_, i) => {
                    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
                });
            //console.log(rowTranslateAnimatedValues);
            const { key, value } = swipeData;
            if (
                value < -Dimensions.get('window').width &&
                !this.animationIsRunning
            ) {
                this.animationIsRunning = true;
                Animated.timing(rowTranslateAnimatedValues[key], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start(() => {
                    const notesValue = [...this.state.notes];
                    var i = notesValue.findIndex(item => item.key === key);
                    notesValue.splice(i, 1)
                    AsyncStorage.setItem(
                        "notes",
                        JSON.stringify(notesValue)
                    ).then(() => {
                        this.setState({ notes: notesValue });
                    });
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
                            // renderSectionHeader={renderSectionHeader}
                            // leftOpenValue={75}
                            // rightOpenValue={-75}
                            // previewRowKey={'0'}
                            // previewOpenValue={-40}
                            // previewOpenDelay={3000}
                            rightOpenValue={-Dimensions.get('window').width}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={1000}
                            onSwipeValueChange={this.onSwipeValueChange}
                            useNativeDriver={false}
                            disableRightSwipe
                        //keyExtractor={(item, index) => item.key}
                        />
                    </View>
                }
                <View style={{ alignItems: 'flex-end', flexDirection: 'column-reverse', flex: 3, position: 'relative' }}>
                    <TouchableOpacity style={styles.addButton}
                        onPress={() => { Actions.note({ values: { name: '' } }) }}
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
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        paddingLeft: 20,
        backgroundColor: '#FAFAFA',
        borderColor: 'gray',
        borderBottomWidth: 0.5,
        borderRadius: 10,
        justifyContent: 'center',
        height: 70,
        marginTop: 3,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: 1,

    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        marginLeft: 5,
        marginTop: 3,
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
        marginTop: '25%'

    },
    addButton: {
        alignItems: 'flex-end',
        marginRight: '7%',
        marginTop: '20%',
        marginBottom: '7%'
    }

})

